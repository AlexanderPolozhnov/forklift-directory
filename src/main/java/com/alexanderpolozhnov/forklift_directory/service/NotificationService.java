package com.alexanderpolozhnov.forklift_directory.service;

import com.alexanderpolozhnov.forklift_directory.config.TelegramProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private static final String TELEGRAM_SEND_MESSAGE_URL = "https://api.telegram.org/bot%s/sendMessage";
    private static final ZoneId MOSCOW_ZONE_ID = ZoneId.of("Europe/Moscow");
    private static final DateTimeFormatter MOSCOW_TIME_FORMATTER = DateTimeFormatter
            .ofPattern("dd.MM.yyyy HH:mm:ss 'МСК'");

    private final TelegramProperties telegramProperties;
    private final RestTemplate restTemplate;

    public void sendForkliftCreated(String forkliftNumber) {
        sendTelegramMessage("Создан погрузчик " + forkliftNumber + " в " + getMoscowTime());
    }

    public void sendForkliftDeleted(String forkliftNumber) {
        sendTelegramMessage("Удален погрузчик " + forkliftNumber + " в " + getMoscowTime());
    }

    private void sendTelegramMessage(String text) {
        if (!StringUtils.hasText(telegramProperties.botToken()) || !StringUtils.hasText(telegramProperties.chatId())) {
            return;
        }

        try {
            String url = TELEGRAM_SEND_MESSAGE_URL.formatted(telegramProperties.botToken());
            Map<String, String> request = Map.of(
                    "chat_id", telegramProperties.chatId(),
                    "text", text);
            restTemplate.postForObject(url, request, String.class);
        } catch (Exception e) {
            log.warn("Не удалось отправить уведомление в Telegram", e);
        }
    }

    private String getMoscowTime() {
        return ZonedDateTime.now(MOSCOW_ZONE_ID).format(MOSCOW_TIME_FORMATTER);
    }
}
