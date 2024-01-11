package com.example.backend.enums;

public enum ContractState {
    WAIT("Chờ duyệt"),
    APPROVED("Đang hiện diện"),
    REJECTED("Đã từ chối"),
    EXPIRED("Đã hết hạn");

    public final String state;

    private ContractState(String state) {
        this.state = state;
    }
}
