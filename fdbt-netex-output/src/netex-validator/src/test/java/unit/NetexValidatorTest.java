package unit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import com.serverless.NetexValidator;
import com.serverless.ValidationResult;
import org.junit.Test;
public class NetexValidatorTest {

    NetexValidator netexValidator = new NetexValidator();

    private String readFromInputStream(InputStream inputStream) throws IOException {
        StringBuilder resultStringBuilder = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = br.readLine()) != null) {
                resultStringBuilder.append(line).append("\n");
            }
        }
        return resultStringBuilder.toString();
    }

    @Test
    public void validatorOutputsErrors() throws IOException {
 
        InputStream inputStream = NetexValidatorTest.class.getResourceAsStream("/testNetexWithErrors.xml");
        String data = readFromInputStream(inputStream);

        ValidationResult result = netexValidator.isNetexValid(data);

        assertEquals(false, result.getValidity());
        assertTrue(result.getErrors().size() > 0);
        System.out.println(result.getErrors().size());
    }

    @Test
    public void validatorReturnsPositiveResultWithValidNetex() throws IOException {

        InputStream inputStream = NetexValidatorTest.class.getResourceAsStream("/validNetex.xml");
        String data = readFromInputStream(inputStream);

        ValidationResult result = netexValidator.isNetexValid(data);

        assertEquals(true, result.getValidity());
        assertTrue(result.getErrors().size() == 0);

    }

}
