<?php

class client {
    private $client;

    public function __construct()
    {
        $client = null;
        
        if (!empty(lib::$data->data->client)) {
            $client = lib::$data->data->client;
        }
        
        $this->client = new clientController($client);
    }

    /**
     * Metodo solicita todos os clientes
     */
    public function get ()
    {
        return lib::$return = ['status' => true, 'clients' => $this->client->get('clients')];
    }

    /**
     * Metodo responsavel por atualizar o cadastro de um cliente
     */
    public function updt () 
    {
        if ($this->client->update() === true) {
            return lib::$return['status'] = true;
        }
    }
}