<?php

class config {
	/**
	 * Consigurações do database
	 */
	private $server = '127.0.0.1';
	private $user =  'root';
	private $password = '12345678';
	private $database = 'parking';
	public $dbType = 'mysql';

    /**
     * Local do servidor
     * @return [string] [servidor criptografado]
     */
	public function getServer()
	{
		return $this->server;
	}

	/**
	 * User do banco de dados
	 * @return [string] [usuario criptografado]
	 */
	public function getUser()
	{
		return $this->user;
	}

	/**
	 * Senha do servidor
	 * @return [string] [senha criptografada]
	 */
	public function getPassword()
	{
		return $this->password;
	}

	/**
	 * Nome da base de dados
	 * @return [string] [banco criptografado]
	 */
	public function getDataBase()
	{
		return $this->database;
	}
}
