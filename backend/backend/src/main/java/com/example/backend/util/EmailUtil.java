package com.example.backend.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Component
public class EmailUtil {
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendOtpToEmail(String toEmail, String otp, String fullname) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);

        mimeMessageHelper.setTo(toEmail);
        mimeMessageHelper.setSubject("[Ads Management] Verify OTP");
        mimeMessageHelper.setText("""
                <div>
                    Hi %s,
                </div>
                <br/>
                <div>
                    This is your private code:
                </div>
                <h3>
                    %s
                </h3>
                <div>
                    <i>Caution: this code will expire three hours after this email was sent.</i>
                </div>
                <div>
                    If you do not make this request, you can ignore this email.
                </div>
                """.formatted(fullname, otp), true);

        javaMailSender.send(mimeMessage);
    }

    public String hashEmail(String email) {
        String splitCharacter = "@";
        String[] emailParts = email.split(splitCharacter);
        String username = emailParts[0];
        String restOfMail = emailParts[1];
        // 3 is a number of characters which we do not change to *
        int lengthOfHashing = username.length() - 3;
        String hashingUsername = "";
        int i = 0;

        for (; i < username.length() - lengthOfHashing; i++) {
            hashingUsername += username.charAt(i);
        }

        for (; i < username.length(); i++) {
            hashingUsername += "*";
        }

        return hashingUsername.concat(splitCharacter).concat(restOfMail);
    }
}
