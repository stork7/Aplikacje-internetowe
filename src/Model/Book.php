<?php
namespace App\Model;

use App\Service\Config;

class Book
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $author = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Book
    {
        $this->id = $id;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): Book
    {
        $this->title = $title;
        return $this;
    }

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function setAuthor(?string $author): Book
    {
        $this->author = $author;
        return $this;
    }

    // Usunięcie getDescription i setDescription

    public static function fromArray($array): Book
    {
        $book = new self();
        $book->fill($array);
        return $book;
    }

    public function fill($array): Book
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['author'])) {
            $this->setAuthor($array['author']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM books'; // Zmienione 'book' na 'books'
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $books = [];
        $booksArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($booksArray as $bookArray) {
            $books[] = self::fromArray($bookArray);
        }

        return $books;
    }

    public static function find($id): ?Book
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM books WHERE id = :id'; // Zmienione 'book' na 'books'
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $bookArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$bookArray) {
            return null;
        }

        return self::fromArray($bookArray);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO books (title, author) VALUES (:title, :author)"; // Zmienione 'book' na 'books'
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'title' => $this->getTitle(),
                'author' => $this->getAuthor(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE books SET title = :title, author = :author WHERE id = :id"; // Zmienione 'book' na 'books'
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':title' => $this->getTitle(),
                ':author' => $this->getAuthor(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM books WHERE id = :id"; // Zmienione 'book' na 'books'
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setTitle(null);
        $this->setAuthor(null);
    }
}
