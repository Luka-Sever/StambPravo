package com.pcelice.backend;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SeleniumTest {

    WebDriver driver;

    @BeforeEach
    public void setup() {
        driver = new ChromeDriver();
    }

    @Test
    public void tryLogin() {
        driver.get("http://localhost:5173/login");
        driver.manage().timeouts().implicitlyWait(Duration.ofMillis(1500));
        List<WebElement> credentials = driver.findElements(By.cssSelector("input"));
        WebElement login = driver.findElement(By.id("register"));

        // prvi je email, drugi lozinka
        WebElement emailField = credentials.get(0), passwordField = credentials.get(1);

        // probavamo dodati admina
        emailField.sendKeys("brunoplese0@gmail.com");
        passwordField.sendKeys("password123");
        login.click();

        WebElement userName = driver.findElement(By.className("user-label"));
        assertEquals("Bruno Plese", userName.getText());


    }

    @Test
    public void title() {
        driver.get("http://localhost:5173/");
        driver.manage().timeouts().implicitlyWait(Duration.ofMillis(500));

        String title = driver.getTitle();
        assertEquals("StanPlan", title);
    }

    @Test
    public void formAMeeting() {

    }

    @AfterEach
    public void teardown() {
        driver.quit();
    }

}
