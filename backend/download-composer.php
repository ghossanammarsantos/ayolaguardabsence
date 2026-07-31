<?php
$installer = file_get_contents('https://getcomposer.org/installer');
if ($installer !== false) {
    file_put_contents(__DIR__ . '/composer-setup.php', $installer);
    echo "Composer installer downloaded successfully.\n";
} else {
    echo "Failed to download composer installer.\n";
}
