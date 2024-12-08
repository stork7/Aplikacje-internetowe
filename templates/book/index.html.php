<?php
/** @var $books array */
/** @var $router \App\Service\Router */
?>
<?php $title = 'Books List'; ?>
<?php ob_start(); ?>
<h1>Books</h1>
<a href="<?= $router->generatePath('book-create') ?>" class="btn btn-primary">Add New Book</a>
<ul>
    <?php if (!empty($books)): ?>
        <?php foreach ($books as $book): ?>
            <li>
                <strong><?= htmlspecialchars($book->getTitle(), ENT_QUOTES, 'UTF-8'); ?></strong> by <?= htmlspecialchars($book->getAuthor(), ENT_QUOTES, 'UTF-8'); ?>

                <ul class="action-list">
                    <li>
                        <a href="<?= $router->generatePath('book-show', ['id' => $book->getId()]) ?>" class="btn btn-info">Show</a>
                    </li>
                    <li>
                        <a href="<?= $router->generatePath('book-edit', ['id' => $book->getId()]) ?>" class="btn btn-warning">Edit</a>
                    </li>
                    <li>
                        <form action="<?= $router->generatePath('book-delete', ['id' => $book->getId()]) ?>" method="post" style="display:inline;">
                            <input type="submit" value="Delete" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this book?')">
                            <input type="hidden" name="action" value="book-delete">
                            <input type="hidden" name="id" value="<?= $book->getId() ?>">
                        </form>
                    </li>
                </ul>
            </li>
        <?php endforeach; ?>
    <?php else: ?>
        <li>No books available.</li>
    <?php endif; ?>
</ul>
<?php $main = ob_get_clean(); ?>
<?php require __DIR__ . '/../base.html.php'; ?>
