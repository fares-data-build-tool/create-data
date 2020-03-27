package com.serverless;

import org.xml.sax.ErrorHandler;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;

import javax.xml.XMLConstants;
import javax.xml.transform.Source;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.LinkedList;
import java.util.List;

public class NetexValidator {
    ValidationResult validationResult;

    public ValidationResult isNetexValid(String bucketName, String key, byte[] s3ByteArray) {
        URL schemaFile = null;

        try {
            schemaFile = new URL(System.getenv("XSD_URL"));
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }

        if (schemaFile != null) {
            ByteArrayInputStream bais = new ByteArrayInputStream(s3ByteArray);
            final Source netexStream = new StreamSource(bais);
            final SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);

            try {
                final Schema schema = schemaFactory.newSchema(schemaFile);
                final Validator validator = schema.newValidator();
                final List<SAXParseException> exceptions = new LinkedList<SAXParseException>();

                validator.setErrorHandler(new ErrorHandler() {
                    @Override
                    public void warning(SAXParseException exception) throws SAXException {
                        exceptions.add(exception);
                    }

                    @Override
                    public void fatalError(SAXParseException exception) throws SAXException {
                        exceptions.add(exception);
                    }

                    @Override
                    public void error(SAXParseException exception) throws SAXException {
                        exceptions.add(exception);
                    }
                });

                validator.validate(netexStream);

                if (exceptions.size() > 0) {
                    return validationResult = new ValidationResult(false, exceptions);
                }

                return validationResult = new ValidationResult(true);

            } catch (SAXException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        System.out.println("HIT");
        return validationResult = new ValidationResult(false);
    }
}