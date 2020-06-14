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
     * Metodo retorna todos os traffics ativos nas vagas
     */
    public function getUsingTraffics ()
    {
        return sql::select(
            "SELECT a.*, b.model, b.license_plate FROM traffics a
            INNER JOIN vehicles b on a.id_vehicle = b.id_vehicle
            WHERE a.departure is null and payed = 0",
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
    public function getTraffic()
    {
        return sql::select(
            "SELECT *, b.model, b.license_plate FROM traffics a
            INNER JOIN vehicles b on a.id_vehicle = b.id_vehicle
            WHERE a.id_traffic = :id",
            ['id' => $this->id]
        )[0];
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
}