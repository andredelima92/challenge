<?php

class trafficController extends controller {
    protected $id = null;
    private $id_vehicle = null;
    private $id_client = null;
    private $entrance = null;
    private $departure = null;
    private $stay_time = null;
    private $price = null;
    public $parking_space = null;
    
    public function __construct($traffic = null)
    {
        if (empty($traffic)) return false;

        if (!empty($traffic->id_traffic)) {
            $this->id = $traffic->id_traffic;
        }
        
        if (!empty($traffic->id_vehicle)) {
            $this->id_vehicle = $traffic->id_vehicle;
        }

        if (!empty($traffic->id_client)) {
            $this->id_client = $traffic->id_client;
        }
         
        if (!empty($traffic->entrance)) {
            $this->entrance = $traffic->entrance;
        }

        if (!empty($traffic->departure)) {
            $this->departure = $traffic->departure;
        }

        if (!empty($traffic->stay_time)) {
            $this->stay_time = $traffic->stay_time;
        }

        if (!empty($traffic->price)) {
            $this->price = $traffic->price;
        }
        
        if (!empty($traffic->parking_space)) {
            if ($traffic->parking_space !== 0) {
                $this->parking_space = $traffic->parking_space;
            }
        }
    }

    public function setVehicle($id)
    {
        $this->id_vehicle = $id;
    }

    public function setClient($id)
    {
        $this->id_client = $id;
    }

    /**
     * Metodo retorna todos os traffics ativos
     */
    public function getUsingTraffics ()
    {
        //DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s') 
        return sql::select(
            "SELECT a.id_traffic, a.id_vehicle, a.id_client, DATE_FORMAT(a.entrance, '%d/%m/%Y %H:%I:%S') as entrance, 
            DATE_FORMAT(a.departure, '%d/%m/%Y %H:%I:%S') as departure, stay_time, a.price, a.payed, a.parking_space, b.model, b.license_plate 
            FROM traffics a
            INNER JOIN vehicles b on a.id_vehicle = b.id_vehicle
            WHERE payed = 0",
            []
        );
    }


     /**
     * Metodo responsavel por verificar se vai inserir ou atualizar uma tabela
     */
    public function delete ()
    {
        if ($this->id === null) {
            lib::$return['err'] = 'Ocorreu um erro ao remover a vaga';
            return false;
        }

        sql::delete(
            'traffics',
            'id_traffic = :id_traffic',
            ['id_traffic' => $this->id]
        );

        lib::$return['status'] = true;
        return true;
    }

    /**
     * Metodo verifica se o veiculo ja não ocupa outra vaga
     */
    public function isBusy ($plate)
    {
        $result = sql::select(
            "SELECT a.id_traffic FROM traffics a 
            INNER JOIN vehicles b ON a.id_vehicle = b.id_vehicle
            WHERE a.departure is null AND b.license_plate = :plate",
            ['plate' => $plate]
        );
        
        if (!empty($result)) {
            lib::$return['err'] = 'Veículo já ocupa outra vaga';
            return true;
        }

        return false;
    }

    /**
     * Metodo retorna o traffic atual na memoria completo do banco
     */
    public function getTraffic ()
    {
        return sql::select(
            "SELECT a.id_traffic, a.id_vehicle, a.id_client, DATE_FORMAT(a.entrance, '%d/%m/%Y %H:%I:%S') as entrance, 
            DATE_FORMAT(a.departure, '%d/%m/%Y %H:%I:%S') as departure, stay_time, a.price, a.payed, a.parking_space, b.model, b.license_plate 
            FROM traffics a
            INNER JOIN vehicles b on a.id_vehicle = b.id_vehicle
            WHERE a.id_traffic = :id",
            ['id' => $this->id]
        )[0];
    }

    /**
     * Metodo realiza o pagamento de uma vaga de estacionamento no banco de dados
     */
    public function pay ()
    {
        $result = sql::update(
            'traffics',
            'payed = 1',
            'id_traffic = :id_traffic',
            ['id_traffic' => $this->id]
        );

        if ($result) return lib::$return['status'] = true;
    }

    /**
     * Verifica se a vaga esta disponivel
     */
    public function spotIsFree($spot)
    {
        $result = sql::select(
            "SELECT id_traffic FROM traffics WHERE parking_space = :spot and departure is null",
            ['spot' => $spot]
        );
        
        if (empty($result)) {
            return true;
        }

        return false;
    }

    /**
     * Metodo realiza a saida de um veiculo na vaga e gera o valor a ser pago
     * Caso seja a 11 vez do veiculo, ele gera o valor zero
     */
    public function updateDeparture ()
    {   
        $price = "(((SELECT hour_value FROM configs WHERE id_config = 1) / 60) /60) * TIME_TO_SEC(stay_time)";
        
        if (lib::$data->data->amount_parking % 11 === 0) {
            $price = 0;
        }

        $result = sql::update(
            'traffics',
            "departure = CURRENT_TIMESTAMP, stay_time = SEC_TO_TIME(TIMESTAMPDIFF(SECOND,traffics.entrance, traffics.departure)), 
            price = $price",
            'id_traffic = :id_traffic',
            ['id_traffic' => $this->id]
        );
        
        if (!$result) {
            lib::$return['err'] = 'Ocorreu um erro ao gerar a baixa no estacionamento';
            return false;   
        }

        return true;
    }
    
    /**
     * Metodo responsavel por inserir um traffic
     */
    protected function insert()
    {
        $result = sql::insert(
            'traffics',
            'id_vehicle, id_client, parking_space',
            ':id_vehicle, :id_client, :parking_space',
            ['id_vehicle' => $this->id_vehicle, 'parking_space' => $this->parking_space, 'id_client' => $this->id_client]
        );

        if ($result === false) {
            lib::$return['err'] = 'Ocorreu um erro ao incluir o veículo no estacionamento';
            return false;
        }

        return true;
    }

    public function reportTraffics ($data1, $data2) {        
        return sql::select(
            "SELECT b.license_plate, b.model, SUM(a.price) as totalPrice
            FROM traffics a
            INNER JOIN vehicles b on a.id_vehicle = b.id_vehicle
            GROUP BY a.id_vehicle
            WHERE a.entrance BETWEEN :data1 AND :data2",
            ['data1' => $data1, 'data2' => $data2]
            
        );
    }
}