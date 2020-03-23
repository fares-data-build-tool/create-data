package unit;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.List;

import com.serverless.ValidationResult;
import org.junit.Test;
import org.xml.sax.SAXParseException;

public class ValidationResultTest {

    @Test
    public void getValidityReturnsValidity(){

        final List<SAXParseException> errors = new ArrayList<SAXParseException>();

		SAXParseException singleError = new SAXParseException("Error message", "Pub ID", "Sys ID",
        45, 5);

        errors.add(0, singleError);

        ValidationResult validationResult = new ValidationResult(false, errors);

        assertEquals(false , validationResult.getValidity());
    }

    @Test
    public void getErrorsReturnsArrayOfErrors(){

        final List<SAXParseException> errors = new ArrayList<SAXParseException>();

		SAXParseException singleError = new SAXParseException("Error message", "Pub ID", "Sys ID",
        45, 5);

        errors.add(0, singleError);

        ValidationResult validationResult = new ValidationResult(false, errors);

        List<SAXParseException> errorResult = validationResult.getErrors();

        assertEquals(singleError, errorResult.get(0));
    }




}
