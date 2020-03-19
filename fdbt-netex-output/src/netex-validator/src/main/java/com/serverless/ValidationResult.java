package com.serverless;

import org.xml.sax.SAXParseException;

import java.util.List;

public class ValidationResult {

    private boolean valid;
    private List<SAXParseException> errors;

    ValidationResult (boolean valid, List<SAXParseException> errors){
        this.valid = valid;
        this.errors = errors;
    }

    ValidationResult (boolean valid){
        this.valid = valid;
    }

    boolean getValidity(){
        return this.valid;
    }

    List<SAXParseException> getErrors(){
        return this.errors;
    }


}
