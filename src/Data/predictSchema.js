export const predictSchema = [
  // -------- Basic Features --------
  { key: "duration", type: "number", min: 0 },
  { key: "protocol_type", type: "binary" }, // encoded
  { key: "service", type: "number", min: 0 }, // encoded
  { key: "flag", type: "binary" }, // encoded
  { key: "src_bytes", type: "number", min: 0 },
  { key: "dst_bytes", type: "number", min: 0 },

  { key: "land", type: "binary" },
  { key: "logged_in", type: "binary" },
  { key: "root_shell", type: "binary" },
  { key: "is_guest_login", type: "binary" },

  // -------- Content Features --------
  { key: "wrong_fragment", type: "number", min: 0, max: 3 },
  { key: "urgent", type: "number", min: 0, max: 14 },
  { key: "hot", type: "number", min: 0, max: 101 },

  { key: "num_failed_logins", type: "number", min: 0, max: 5 },
  { key: "su_attempted", type: "binary" },

  { key: "num_file_creations", type: "number", min: 0, max: 100 },
  { key: "num_outbound_cmds", type: "number", min: 0, max: 0 }, // always 0
  { key: "is_host_login", type: "binary" },

  // -------- Traffic Count Features --------
  { key: "count", type: "number", min: 0, max: 511 },
  { key: "srv_count", type: "number", min: 0, max: 511 },

  // -------- Rate Features (NOT binary!) --------
  { key: "serror_rate", type: "rate" },
  { key: "srv_serror_rate", type: "rate" },
  { key: "rerror_rate", type: "rate" },
  { key: "srv_rerror_rate", type: "rate" },

  { key: "same_srv_rate", type: "rate" },
  { key: "diff_srv_rate", type: "rate" },
  { key: "srv_diff_host_rate", type: "rate" },

  // -------- Host-based Count --------
  { key: "dst_host_count", type: "number", min: 0, max: 255 },
  { key: "dst_host_srv_count", type: "number", min: 0, max: 255 },

  // -------- Host-based Rate --------
  { key: "dst_host_same_srv_rate", type: "rate" },
  { key: "dst_host_diff_srv_rate", type: "rate" },
  { key: "dst_host_same_src_port_rate", type: "rate" },
  { key: "dst_host_srv_diff_host_rate", type: "rate" },

  { key: "dst_host_serror_rate", type: "rate" },
  { key: "dst_host_srv_serror_rate", type: "rate" },
  { key: "dst_host_rerror_rate", type: "rate" },
  { key: "dst_host_srv_rerror_rate", type: "rate" }
];