CREATE TABLE IF NOT EXISTS `transcript` (
    `id` varchar(36) NOT NULL,
    `label` varchar(255) NOT NULL,
    `transcript` text,
    `processed` tinyint NOT NULL DEFAULT 0,
    `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `transcript_id` PRIMARY KEY(`id`)
);