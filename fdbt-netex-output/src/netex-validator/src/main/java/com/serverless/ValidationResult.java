package com.serverless;

import org.xml.sax.SAXParseException;

import java.util.List;

public class ValidationResult {

    private boolean valid;
    private List<SAXParseException> errors;

    public ValidationResult (boolean i, List<SAXParseException> k){
        valid = i;
        errors = k;
    }

    public boolean getValidity(){
        return this.valid;
    }

    public List<SAXParseException> getErrors(){
        return this.errors;
    }


}
