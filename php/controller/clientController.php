<?php

class clientController extends controller {
    protected $id = null;
    private $name = null;
    private $amount_parking = null;
    private $phone = null;

    public function __construct($client = null)
    {
        if (!empty($client->id_client)) {
            $this->id = $client->id_client;
        }

        if (!empty($client->name)) {
            $this->name = $client->name;
        }
         
        if (!empty($client->amount_parking)) {
            $this->amount_parking = $client->amount_parking;
        }

        if (!empty($client->phone)) {
            if (strlen($client->phone) > 0 && strlen($client->phone) < 10) {
                $client->phone = '14' . $client->phone;
            }

            $this->phone = $client->phone;
        }
    }

    /**
     * Valida o telefone do cliente
     */
    public function validPhone($phone)
    {
        if (strlen($phone) > 0 && strlen($phone) < 10) {
            return false;
        }

        return true;
    }
    
    /**
     * Metodo responsavel por cadastrar um novo cliente
     */
    protected function insert()
    {
        if (empty($this->name)) {
            lib::$return = ['status' => false, 'err' => 'Nome do cliente não pode estar em branco'];
            return false;
        }

        if ($this->validPhone($this->phone) === false) {
            lib::$return = ['status' => false, 'err' => 'Telefone do cliente inválido'];
            return false;
        }

        $result = sql::insert('clients', 'name, phone', ':name, :phone', 
                            ['name' => $this->name, 'phone' => $this->phone]
        );

        if ($result === false) {
            lib::$return = ['status' => false, 'err' => 'Ocorreu um erro ao inserir o cliente'];
            return false;
        }
        
        return true;
    }
}