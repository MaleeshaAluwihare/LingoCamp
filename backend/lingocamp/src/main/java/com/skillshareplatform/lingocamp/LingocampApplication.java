package com.skillshareplatform.lingocamp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class LingocampApplication {

	public static void main(String[] args) {
		SpringApplication.run(LingocampApplication.class, args);
	}

	@GetMapping("/dashboard")
	public String rootEndpoint(){
		String message = "Spring Running!";
		return message;
	}

}
