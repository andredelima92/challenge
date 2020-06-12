<?php
require_once('autoload.php');

class lib
{
    public static $return = [];
    public static $data;

    /**
     * Remove algum caracter indesejado de uma string
     * @param string $str  [caracteres que serão retirados]
     * @param string $data [string que sera tratada]
     * @return string [string tratada]
     */
    private static function treatSpecificData(string $str, $data)
    {
        return preg_replace('/'. $str .'/i', '', $data);
    }

    /**
	 * Contem as palavras reservadas que sera tratada no sqlInjection
	 * @var [array]
	 */
	private static $inject = [
        'select', 'update', 'where', 'left', 'not', 'like', 'drop', 'alter', 'insert', 'delete', 
        'join', 'inner', 'truncate', 'create', 'delimiter'
    ];

	/**
     * Monta os dados sujeito e ação vindos do clienet dinamicamente
     * @param  [object] $data [objeto que servira para montar o subject e action da framework]
     * @return [array]        [devolve um array pronto para a framework]
     */
    private function mountData($data)
    {
        $arr['subject'] = $data->s;
        $arr['action'] = $data->a;
        return $arr;
    }

    /**
     * Metodo recebe os dados enviados pelo usuario por POST ou GET
     * @return [object]     [objecto com os dados enviados]
     */
    private function getUserData()
    {   
    	if ($_POST) {
    		return $_POST['data'];
        } 
        
        return $_GET['data'];
    }

    /**
     * Metodo limpa os dados contra as palavras reservadas do injection
     * @param  [string, int, boolean, decimal] $data [os dados a serem tratados]
     * @return [string, int, boolean, decimal]       [os dados ja tratados]
     */
    private static function cleanInjection($data)
    {
        $data = self::treatSpecificData('[^a-z0-9 @.$&-=_]', $data);
        $data = self::treatSpecificData('--', $data);
        $data = addslashes($data);

        foreach(self::$inject as $i) {
            $data = self::treatSpecificData($i, $data );
        }

        return $data;
    }

    /**
     * Trata os dados vindos do cliente contra sql injection
     * @param  [array] $data [todos os dados que serão tratados]
     * @return [array]       [dados ja tratados]
     */
    private function treatSqlInjection($data)
    {
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $value = (object) $value;
            }

            if (is_object($value)) {
                foreach ($value as $keyTwo => $valueTwo) {
                    if (is_object($valueTwo)) {
                        foreach ($valueTwo as $k => $v) {
                            $valueTwo->$k = self::cleanInjection($v);
                        }

                        continue;
                    }
                    
                    $value->$keyTwo = self::cleanInjection($valueTwo);
                }

                continue;              
            }

            $data->$key = self::cleanInjection($value);
        }
        
        return $data;
    }

    /**
     * Retorna os dados do servidor para o cliente que estão gravados no school::$return
     * @return [JSON]          [traforma em json e devolve os dados]
     */
    public static function returnData()
    {
        $return = lib::$return;
        
        if (empty($return)) {
            $return = [];
        }

        if (empty($return['status'])) {
            $return['status'] = false;
        } 

        if (!empty(self::$return['msg'])) {
        	$return['msg'] = self::$return['msg'];
        }

        echo json_encode($return);
    }

    /**
     * Metodo recebe os dados que o usuario enviou para o servidor
     * @param  [boolean] $json [caso seja true, os dados estão vindo como json sempre]
     * @return [object]        [devolve um objeto com os dados que forão enviados]
     */
    public static function reciveData($json = true)
    {
        $data = self::getUserData();
        
        if ($json === true) {
            $data = json_decode($data);
        }

        self::$data = self::treatSqlInjection($data);
    
        return true;
    }

    /**
     * Metodo que inicializa o sistema no query.php
     * @param  [object] $data    [objeto que foi enviado pelo usuario com o sujeito e ação]
     * @param  [string] $project [nome da pasta do projeto que esta invocando o init]
     * @return [boolean or array]          [retorna um array com sujeito e ação caso existirem, ou false]
     */
    public function init()
    {   
        return self::mountData(self::$data);
    } 
}

/**
 * Metodo dump and die, ele debuga uma variavel e mostra informações sobre ela, e depois mata o processo
 * @param  any $var [É informado uma variavel para debugar]
 * @return string   [retorna a depuração na tela]
 */
function dd($var = 'Without variable') 
{
    $file = explode('/', debug_backtrace()[0]['file']);
    $file = $file[count($file) - 1];
    $line = debug_backtrace()[0]['line'];
    echo '<pre><font color="red"><h4>';
    echo '
    #######################################################
    #                                                     #
    #                                                     #                                     
    #                   SCHOOL DEBUG                      #
    #                                                     #
    #                                                     #  
    #######################################################<br><br>';
    echo'</h4></font>';
    echo '<font color="blue">Name:</font><font color="green">'. $file .'</font><br>';
    echo '<font color="blue">Line:</font><font color="green">'. $line .'</font><br>';
    echo '<font color="blue"><h2>RESULT</h2></font>';
    var_dump($var);
    die('<font color="red"><h4>FIM DO DEBUG</h4></font>');
}
