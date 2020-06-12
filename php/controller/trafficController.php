<?php

class trafficController extends controller {
    protected $id = null;
    private $id_vehicle = null;
    private $entrance = null;
    private $departure = null;
    private $stay_time = null;
    private $price = null;
    public $parking_space = null;
    
    public function __construct($traffic = null)
    {
        if (!empty($traffic->id_traffic)) {
            $this->id = $traffic->id_traffic;
        }
        
        if (!empty($traffic->id_vehicle)) {
            $this->id_vehicle = $traffic->id_vehicle;
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
        
        if (!empty($traffic->parking_space) || $traffic->parking_space == 0) {
            $this->parking_space = $traffic->parking_space;
        }
    }

    public function setVehicle($id)
    {
        $this->id_vehicle = $id;
    }

    /**
     * Metodo retorna o traffic atual na memoria completo do banco
     */
    public function getTraffic()
    {
        return sql::select(
            "SELECT * FROM traffics WHERE id_traffic = :id",
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
            'id_vehicle, parking_space',
            ':id_vehicle, :parking_space',
            ['id_vehicle' => $this->id_vehicle, 'parking_space' => $this->parking_space]
        );

        if ($result === false) {
            lib::$return = ['status' => false, 'err' => 'Ocorreu um erro ao incluir o veículo no estacionamento'];
            return false;
        }

        lib::$return = ['status' => true];
        return true;
    }
}