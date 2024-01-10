package com.example.backend.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.backend.dto.MessageWebSocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Controller
@CrossOrigin
public class MessageWebSocketController {
    private static final Logger logger = Logger.getLogger(MessageWebSocketController.class);
    // Mapped as /app/application
    @MessageMapping("/application")
    @SendTo("/all/messages")
    public MessageWebSocket sendReportToStaff(@Payload MessageWebSocket message) throws Exception {
        logger.info("Send report to staff");
        return message;
    }

    // Mapped as /app/private
    @MessageMapping("/private")
    @SendTo("/person/messages")
    public MessageWebSocket sendSolutionToPerson(@Payload MessageWebSocket message) throws Exception {
        logger.info("Send solution to person");
        return message;
    }
}
