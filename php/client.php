<?php

class client {

    /**
     * Metodo solicita todos os clientes
     */
    public function get ()
    {
        $client = new clientController();

        return lib::$return = ['status' => true, 'clients' => $client->get('clients')];
    }
}