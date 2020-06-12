<?php

final class sql {
    private static $sql;
    
    private function __construct(){}

    /**
     * Inicializa a conexão com o banco de dados
     * @return [boolean] [true]
     */
    private static function start()
    {
        if (!empty(self::$sql))  {
            return true;
        }

        $config = new config;
        $server = $config->getServer();
        $dbName = $config->getDataBase();
        $user   = $config->getUser();
        $pass   = $config->getPassword();

        self::$sql = new PDO("mysql:host={$server};port=3306;dbname={$dbName}", $user, $pass);
        
        self::$sql->query("SET NAMES 'utf8'");
        self::$sql->query('SET character_set_connection=utf8');
        self::$sql->query('SET character_set_client=utf8');
        self::$sql->query('SET character_set_results=utf8');

        return true;
    }

    /**
     * Realiza um select no banco de dados
     * @param  string $table     [string]
     * @return [array]           [retorna um  array com os dados]
     */
    public static function select(string $string, array $values = [])
    {   
        self::start();

        $prepare = self::$sql->prepare($string);
        $prepare->execute($values);
        
        return self::makeArrayFromDataQuery($prepare);
    }

    /**
     * Realiza um delete no banco de dados
     * @param  string $tabel     [tabela]
     * @param  string $condition [condição]
     * @return [boolean]         [true or false]
     */
    public static function delete(string $tabel, string $condition, array $values)
    {
        self::start();

        return self::$sql->prepare("DELETE FROM ". $tabel ." WHERE ". $condition)->execute($values);
    }

    /**
     * Realiza um update no banco de dados
     * @param  string $tabel     [tabela]
     * @param  string $set       [informações que serão atualizadas]
     * @param  string $condition [condição]
     * @return [boolean]         [true or false]
     */
    public static function update(string $tabel, string $set, string $condition, array $values)
    {
        self::start();
        
        return self::$sql->prepare("UPDATE ". $tabel ." SET ". $set ." WHERE ". $condition)->execute($values);
    }

    /**
     * Realiza um insert no banco de dados
     * @param  string $tabel  [table]
     * @param  array  $fields [campos]
     * @param  array  $values [valores]
     * @return [boolean]      [true or false]
     */
    public static function insert(string $tabel, string $fields, string $binds, array $values)
    {
        self::start();

        return self::$sql->prepare("INSERT INTO ". $tabel ." (". $fields .") VALUES (". $binds .")")->execute($values);
    }

    /**
     * Retorna o id do ultimo registro inserido no banco de dados
     * @return [int] [id]
     */
    public static function getLastInsertId()
    {
        return self::$sql->lastInsertId();
    }

    /**
     * Monta um array com os registros retornados do select
     * @param  [mysqli_result] $data [objeto retornado do select]
     * @return [array]               [array com os dados]
     */
    private static function makeArrayFromDataQuery($data)
    {  
        $result = [];
        
        while ($row = $data->fetch(PDO::FETCH_ASSOC) ) {
            $result[] = $row;
        }
        
        return $result;
    }
};
?>
