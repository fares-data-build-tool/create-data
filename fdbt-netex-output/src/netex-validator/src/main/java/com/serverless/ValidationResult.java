package com.serverless;

import org.xml.sax.SAXParseException;

import java.util.List;

public class ValidationResult {

    private boolean valid;
    private List<SAXParseException> errors;

    public ValidationResult (boolean valid, List<SAXParseException> errors){
        this.valid = valid;
        this.errors = errors;
    }

    public ValidationResult (boolean valid){
        this.valid = valid;
    }

    public boolean getValidity(){
        return this.valid;
    }

    public List<SAXParseException> getErrors(){
        return this.errors;
    }


}
