package cloud.nexpartner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.expression.*;
import org.springframework.expression.spel.standard.SpelExpressionParser;

@SpringBootApplication
@RestController
public class OpsApplication {
    public static void main(String[] args) { SpringApplication.run(OpsApplication.class, args); }
    @PostMapping("/api/v1/calculate-quota")
    public String calculate(@RequestBody String expression) {
        ExpressionParser parser = new SpelExpressionParser();
        return parser.parseExpression(expression).getValue().toString();
    }
}
