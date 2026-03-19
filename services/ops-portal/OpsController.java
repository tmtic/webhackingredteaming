// Simulação de controlador Spring com falhas de expressão
@RestController
public class OpsController {
    // M5-L08: Spring Expression Abuse (SpEL)
    @PostMapping("/calculate-quota")
    public String calculate(@RequestBody String expression) {
        ExpressionParser parser = new SpelExpressionParser();
        return parser.parseExpression(expression).getValue().toString();
    }
}
// M5-L07: Ativado via application.properties: management.endpoints.web.exposure.include=*
