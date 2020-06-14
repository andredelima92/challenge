<?php

class vehicle {

    /**
     * Metodo solicita todos os veiculos
     */
    public function get ()
    {
        $vehicle = new vehicleController();

        return lib::$return = ['status' => true, 'vehicles' => $vehicle->get('vehicles')];
    }
}