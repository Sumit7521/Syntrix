export const predictSchema = [
  { key: "duration", type: "number", min: 0 },
  { key: "protocol_type", type: "binary" },
  { key: "service", type: "number", min: 0 },
  { key: "flag", type: "binary" },
  { key: "src_bytes", type: "number", min: 0 },
  { key: "dst_bytes", type: "number", min: 0 },

  { key: "land", type: "binary" },
  { key: "logged_in", type: "binary" },
  { key: "root_shell", type: "binary" },
  { key: "is_guest_login", type: "binary" },

  { key: "wrong_fragment", type: "number", min: 0 },
  { key: "urgent", type: "number", min: 0 },
  { key: "hot", type: "number", min: 0 },

  { key: "num_failed_logins", type: "number", min: 0 },
  { key: "su_attempted", type: "binary" },

  { key: "num_file_creations", type: "number", min: 0 },
  { key: "num_outbound_cmds", type: "number", min: 0 },
  { key: "is_host_login", type: "binary" },

  { key: "count", type: "number", min: 0 },
  { key: "srv_count", type: "number", min: 0 },

  { key: "serror_rate", type: "binary" },
  { key: "srv_serror_rate", type: "binary" },
  { key: "rerror_rate", type: "binary" },
  { key: "srv_rerror_rate", type: "binary" },

  { key: "same_srv_rate", type: "binary" },
  { key: "diff_srv_rate", type: "binary" },
  { key: "srv_diff_host_rate", type: "binary" },

  { key: "dst_host_count", type: "number", min: 0 },
  { key: "dst_host_srv_count", type: "number", min: 0 },

  { key: "dst_host_same_srv_rate", type: "binary" },
  { key: "dst_host_diff_srv_rate", type: "binary" },
  { key: "dst_host_same_src_port_rate", type: "binary" },
  { key: "dst_host_srv_diff_host_rate", type: "binary" },

  { key: "dst_host_serror_rate", type: "binary" },
  { key: "dst_host_srv_serror_rate", type: "binary" },
  { key: "dst_host_rerror_rate", type: "binary" },
  { key: "dst_host_srv_rerror_rate", type: "binary" }
];
