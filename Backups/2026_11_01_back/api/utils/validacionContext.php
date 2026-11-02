<?php

// context.php
class ValidacionRequest {
    private static $user = null;

    public static function setUser($u) {
        self::$user = $u;
    }

    public static function getUser() {
        return self::$user;
    }
}
