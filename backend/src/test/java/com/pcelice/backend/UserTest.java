package com.pcelice.backend;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class UserTest {

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
    public void invalidCredentials() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        driver.get("http://localhost:5173/login");
        driver.manage().timeouts().implicitlyWait(Duration.ofMillis(1500));
        List<WebElement> credentials = driver.findElements(By.cssSelector("input"));
        WebElement login = driver.findElement(By.id("register"));

        // prvi je email, drugi lozinka
        WebElement emailField = credentials.get(0), passwordField = credentials.get(1);

        // probavamo dodati admina
        emailField.sendKeys("bruawdasdawnoplese0@gmail.com");
        passwordField.sendKeys("password123");
        login.click();

        WebElement emailWrong = driver.findElement(By.cssSelector(".status-message"));

        assertEquals("Nevažeći podaci za prijavu. Molimo pokušajte ponovno.", emailWrong.getText());

    }

    @Test
    public void createAUser() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        driver.get("http://localhost:5173/login");
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("register")));
        List<WebElement> credentials = driver.findElements(By.cssSelector("input"));
        WebElement login = driver.findElement(By.id("register"));

        WebElement emailField = credentials.get(0), passwordField = credentials.get(1);

        // probavamo dodati admina
        emailField.sendKeys("brunoplese0@gmail.com");
        passwordField.sendKeys("password123");
        login.click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.className("user-label")
        ));

        driver.get("http://localhost:5173/admin");

        driver.manage().timeouts().implicitlyWait(Duration.ofMillis(1500));
        List<WebElement> inputs = driver.findElements(By.cssSelector("input"));

        inputs.get(0).sendKeys("luka.sever20@gmail.com");
        inputs.get(1).sendKeys("lukas");
        inputs.get(2).sendKeys("L");
        inputs.get(3).sendKeys("S");
        inputs.get(4).sendKeys("password123");
        inputs.get(5).sendKeys("password123");

        WebElement adresaZgrade = wait.until(
                ExpectedConditions.elementToBeClickable(By.cssSelector("[placeholder=\"Adresa\"]"))
        );
        WebElement postanskiBroj = driver.findElement(By.cssSelector("[placeholder=\"Poštanski broj\"]"));
        adresaZgrade.sendKeys("Unska 3");
        postanskiBroj.sendKeys("10000");

        WebElement kreirajZgradu = driver.findElement(
                By.xpath("//h2[text()='Kreiraj zgradu']/following::button[1]")
        );
        kreirajZgradu.click();

        List<WebElement> selectElementi = driver.findElements(By.cssSelector(".role-select"));

        Select zgrada = new Select(selectElementi.get(0)), uloga = new Select(selectElementi.get(1));

        zgrada.selectByIndex(1);
        uloga.selectByIndex(1);

        WebElement stvoriKorisnika = driver.findElement(
                By.xpath("//h2[text()='Kreiraj korisnika']/following::button[1]")
        );

        stvoriKorisnika.click();

        WebElement odgovor = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//p[contains(text(), 'Korisnik')]")
        ));

        assertEquals("Korisnik lukas je uspješno kreiran!", odgovor.getText());
    }


    @Test
    public void addPresonToBuilding() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        driver.get("http://localhost:5173/login");
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("register")));
        List<WebElement> credentials = driver.findElements(By.cssSelector("input"));
        WebElement login = driver.findElement(By.id("register"));

        WebElement emailField = credentials.get(0), passwordField = credentials.get(1);

        // probavamo dodati admina
        emailField.sendKeys("brunoplese0@gmail.com");
        passwordField.sendKeys("password123");
        login.click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.className("user-label")
        ));

        driver.get("http://localhost:5173/admin");
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".role-select")
        ));

        List<WebElement> allRoleSelects = driver.findElements(By.cssSelector(".role-select"));
        WebElement dodajPredstavnikaZgradi = allRoleSelects.get(2);

        Select select = new Select(dodajPredstavnikaZgradi);
        select.selectByIndex(1);
        WebElement imePredstavnika = driver.findElement(By.cssSelector("input[placeholder='Email predstavnika']"));
        imePredstavnika.sendKeys("brunoplese0@gmail.com");

        WebElement dodajPredstavnika = driver.findElement(
                By.xpath("//button[contains(text(), 'DODAJ PREDSTAVNIKA')]")
        );
        dodajPredstavnika.click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".status-message")
        ));
        WebElement message = driver.findElement(
                By.cssSelector(".status-message")
        );
        assertEquals("Predstavnik uspješno dodan zgradi!", message.getText());

    }

    @AfterEach
    public void teardown() {
        driver.quit();
    }
}
