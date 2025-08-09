import logging
import sys
import time

class LoggingClient:
    @staticmethod
    def get_logger(name: str, level: int = logging.INFO):
        # create a new logger or returns an existing one if already declared
        logger = logging.getLogger(name)
        logger.setLevel(level)

        # avoid adding duplicate loggers
        if not logger.handlers:
            # create console handler
            console_handler = logging.StreamHandler(sys.stdout)
            console_handler.setLevel(level)

            # create and set formatter
            fmt = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            formatter = logging.Formatter(fmt)
            formatter.converter = time.gmtime  # ensures UTC logs
            console_handler.setFormatter(formatter)

            # add handler to logger
            logger.addHandler(console_handler)

            # prevent duplicate logs from parent loggers
            logger.propagate = False

        return logger
