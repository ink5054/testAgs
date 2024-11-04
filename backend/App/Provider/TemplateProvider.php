<?php

namespace App\Provider;

use App\Config\TemplateConfig;
use App\Exception\TemplateException;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;
use Twig\Loader\FilesystemLoader;

class TemplateProvider
{
    private static TemplateProvider $instance;

    public function __construct(
        private readonly Environment $env
    ) {
    }

    public static function init(array|string $paths = TemplateConfig::TEMPLATES_DIR): void
    {
        $env = new Environment(new FilesystemLoader($paths), [
            'debug' => true,
            'cache' => false
        ]);

        self::$instance = new TemplateProvider($env);
    }

    public static function get(): TemplateProvider
    {
        return self::$instance;
    }

    /**
     * @param string $tpl Название файла twig-шаблона без расширения
     * @param array $vars Дополнительные переменные
     *
     * @return string HTML шаблона
     * @throws TemplateException
     */
    public function render(string $tpl, array $vars = []): string
    {
        if (self::$instance->env == null) {
            throw new TemplateException('Twig isn\'t initialized!');
        }

        try {
            return self::$instance->env->render("$tpl.twig", array_merge($vars, [
                'cache' => time(),
            ]));
        } catch (LoaderError|RuntimeError|SyntaxError $e) {
            throw new TemplateException($e->getMessage(), $e->getCode(), $e);
        }
    }
}
