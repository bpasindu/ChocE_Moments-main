import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    performedBy: {
        type: String, // Email of the admin
        required: true
    },
    targetId: {
        type: String, // ID of the object being modified (e.g., productId)
        required: true
    },
    details: {
        type: Object, // Store before/after values
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const AuditLog = mongoose.model("audit_logs", auditLogSchema);

export default AuditLog;
