package com.example.backend.controller;

import com.example.backend.dto.ReCaptchaResponse;
import com.example.backend.entity.AdsPosition;
import com.example.backend.entity.Report;
import com.example.backend.exception.AppException;
import com.example.backend.exception.RestExceptionHandler;
import com.example.backend.service.AdsService;
import com.example.backend.service.ReportService;
import com.example.backend.util.EmailUtil;
import com.example.backend.util.OtpUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.mail.MessagingException;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/report")
//@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {
    private final ReportService reportService;
    private final EmailUtil emailUtil;

    @Value("${recaptcha.secret}")
    private String recaptchaSecret;

    @Value("${recaptcha.url}")
    private String recaptchaUrl;

    @GetMapping("")
    public ResponseEntity<List<Report>> getAllReport(){
        System.out.println(1);
        List<Report> result = reportService.getAllReport();
        System.out.println(result);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetailPosition(@PathVariable(value = "id") Integer id){
        Optional<Report> report = reportService.getDetailReport(id);
        if(report != null){
            return new ResponseEntity<>(report, HttpStatus.OK);
        }
        return new ResponseEntity<>("Id Not found", HttpStatus.NOT_FOUND);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Report> updateFilm(@PathVariable (value = "id") Integer id,@Valid @RequestBody Report report){

        Optional<Report> dbReport =reportService.getDetailReport(id);
        if(dbReport!=null){
            report.setId(id);
//            if(task.getDescription()==null){
//                task.setDescription(dbTask.getDescription());
//            }

            Report res=reportService.saveReport(report);
            String mess = report.getSolving();
            String email= report.getEmail();
            String fullname =report.getFullName();
            try {
                emailUtil.sendMessToEmail(email, mess, fullname);
            } catch (MessagingException ex) {
                throw new RuntimeException("Unable to send mess, please try again");
            }

        }


        return ResponseEntity.ok(report);
    }
    @PostMapping()
    public Report addReport(@Valid @RequestBody Report report, HttpServletRequest request){
        RestTemplate restTemplate = new RestTemplate();
        String url = recaptchaUrl + "?secret=" + recaptchaSecret + "&response=" + "03AFcWeA4hufn2zPaNuvxcSa6psQ0MwCUbyUKa771FA9F7KJ3gO5uZsk16uJMgxxWQN98CgGO6o9_ecuVHYdWH3zMIkiO-H-PKY5O-AI_4nPxDWf6iy5MbYb8_YxEMtuYBdswedHwT0_dtTr1p_AONihS7UZ7bZvMWgV2OLHnCdsHr_EdjgYQrwYT0BGePEV0l5xERmF6CshatU3viNKeVS-B4pTES3g0U58cbipMVo0UXR8ieP6r8wGJRycV7l2AscFHc2N4dIYuhz5DEgqbjWMrssmNK_L7i_24UbWHvgBOYwbjkISlhs1OvtFOBWRLjKisxoRPeTlZ6nvBj_60FE9N9qUtVske1XVqNRZmXfW3t28wTnhog6IHoSosmnq7pYGmG3MjI8JpzbqgaqQ1ezVVGnuaIo_THkxxgSOstbrJcWd33uLG_OdamzE-s1fqn0FjQtaALLWKdhQ6zTIAjQ8iodOqvDxlV1I8SOI42p7_83BBkS6wH6eylydtkLPwb38Ucna2rkjHGSoTKw_DJ8e5RlqU8A3gwmg3Derm5NU3MDigeNF3zJkmVPq1uj-E3ez-_2n5v5boqMfNyb7ukKpmC635wyR-cWVgGLqQaUmsoYj88sk3zAYiKNHgwMqRPJbrsSj43D9zk9VJu3waBwmDLfKUAAi-DJSbT6I4EI6QYOLtmkG0qVfir9AFJ0MwgLT2aFbcXVlLn3Yc7aHL1PXj5VEP4oJXkQBm6JXmtSYaMLibVWsa6A_Pe5hPNBXNkYabyWZyuWxhnv8Jmh2TcxFk80jiTZPSQcmM5QO48bmHxEhJZBgJ_e6X9k2AxdG7UqTkeWyWK1KuAfOecYIKFVLpd7pdj5GgCMpcIfLDzemZJTgF147Oh_ulUnEE3kbcammRKNlnKFEOdRUyBCK4SPgaeKx_rUbdE-STTRbdmevxYP0j6zAzP3B1v1Ns_925tbLlgtymM0a_pYDlFSIeZinYAraRYvyInKm2x06KvVPCZ3ffxdVb3qpIE-Wi5azIEIFLxIBpopdgznt9iVIqraB584NbYm6Bjls-sW8TfhOjb7xbVrVmfWSAuHUSdmxvxjhx0fAYDixKgw4rZh9mq16t1hYtdoYddaq19mow-jKt6kkg7OrrPrPuNlvzLaqNvNL3I_PdwbMJMjJ0bweKrQUFD3VT4wL0KYf6I_8Z-HdCI9vPIniKB6yX3SOaiPsmZgUFarladjmZdRISx7LxxGXsf3IThzblzHkPtfCkV4ZYI2rf_0HMVJnFN8mBoa4PSS7irVH21e_KeNBRucm5nisbBVxd2YizhD2pr0mdiRA71oU4voJMWHDbXuo7AA2FiGm1EcXHK7hLw5yypakhOy3jGgo0d4kbI3Ewjb6-AAnp-NeT8W4drDzDaPmuxjFNF7lE_SEQucTSn4SkqRVLvm7c78OAaOrPeBkG4gJRT2VipQXOy2JGpVoxYoyFYJvunmrgnt0Zi9sBg7ASonPjH3rn9qhmrroRwCYF2qLi_6RwxMANezWGc3xGzULYLzz9E9agOYIIFPSEllC8jh0uMRNlsS3XBwkPEZSptwO0UDYRsGdHro6ie2YdxYQAh20JAYuRm-UbClVUjgGXG3lmdFtgPcdLSLBMA";
        ReCaptchaResponse response = restTemplate.postForObject(url, null, ReCaptchaResponse.class);
        if (response.isSuccess() == false) {
            throw new AppException(400, HttpStatus.BAD_REQUEST, "You are robot");
        }
        report.setId(0);
        report.setSolving("");
        Report dbReport = reportService.saveReport(report);
        return dbReport;
    }
}
