package com.example.backend.enums;

public enum OurHttpCode {
    BAD_REQUEST(240),
    NOT_FOUND(244);

    public final int code;

    private OurHttpCode(Integer code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}
