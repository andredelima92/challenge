<?php

/**
 * Faz o carregamento automatico das classes
 */
spl_autoload_register(function ($classname) {
    $arr = ['', 'controller/'];

    foreach ($arr as $dir) {
        $file = $dir . $classname . '.php';
        if (file_exists($file)) {
            return require_once($file);
        }
    }
});