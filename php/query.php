<?php
include_once $_SERVER['DOCUMENT_ROOT']. "/challenge/php/lib.php";

lib::reciveData(true);

if (lib::$data) {
    extract(lib::init());

	if (isset($subject) && isset($action)) {
	    $obj = new $subject();
	    $obj->$action();
        
	    return lib::returnData();
	} 
}

lib::$return = ['status' => false, 'msg' => 'Ocorreu um erro com sua requisição'];
return lib::returnData();    
