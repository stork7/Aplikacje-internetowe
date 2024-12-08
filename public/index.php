<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

// Inicjalizacja usług
$config = new \App\Service\Config();
$templating = new \App\Service\Templating();
$router = new \App\Service\Router();

// Pobieranie akcji z requestu
$action = $_REQUEST['action'] ?? null;

// Obsługa akcji
switch ($action) {
    // Posty
    case 'post-index':
    case null:
        $controller = new \App\Controller\PostController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'post-create':
        $controller = new \App\Controller\PostController();
        $view = $controller->createAction($_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-edit':
        if (!isset($_REQUEST['id'])) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-show':
        if (!isset($_REQUEST['id'])) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'post-delete':
        if (!isset($_REQUEST['id'])) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;

    // Książki
    case 'book-index':
        $controller = new \App\Controller\BookController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'book-create':
        $controller = new \App\Controller\BookController();
        $view = $controller->createAction($_REQUEST['book'] ?? null, $templating, $router);
        break;
    case 'book-edit':
        if (!isset($_REQUEST['id'])) {
            break;
        }
        $controller = new \App\Controller\BookController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['book'] ?? null, $templating, $router);
        break;
    case 'book-show':
        if (!isset($_REQUEST['id'])) {
            break;
        }
        $controller = new \App\Controller\BookController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'book-delete':
        if (!isset($_REQUEST['id'])) {
            break;
        }
        $controller = new \App\Controller\BookController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;

    // Strona Info
    case 'info':
        $controller = new \App\Controller\InfoController();
        $view = $controller->infoAction();
        break;

    default:
        $view = 'Not found';
        break;
}

// Wyświetlanie widoku
if ($view) {
    echo $view;
}
