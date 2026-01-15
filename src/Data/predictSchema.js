export const NORMAL_DEFAULT_VALUES = {
  duration: 15,
  protocol_type: 0,
  service: 34,
  flag: 1,
  src_bytes: 320,
  dst_bytes: 2100,
  land: 0,
  logged_in: 1,
  root_shell: 0,
  is_guest_login: 0,
  wrong_fragment: 0,
  urgent: 0,
  hot: 0,
  num_failed_logins: 0,
  su_attempted: 0,
  num_file_creations: 0,
  num_outbound_cmds: 0,
  is_host_login: 0,
  count: 6,
  srv_count: 6,
  serror_rate: 0.0,
  srv_serror_rate: 0.0,
  rerror_rate: 0.0,
  srv_rerror_rate: 0.0,
  same_srv_rate: 0.92,
  diff_srv_rate: 0.08,
  srv_diff_host_rate: 0.05,
  dst_host_count: 120,
  dst_host_srv_count: 95,
  dst_host_same_srv_rate: 0.94,
  dst_host_diff_srv_rate: 0.06,
  dst_host_same_src_port_rate: 0.88,
  dst_host_srv_diff_host_rate: 0.03,
  dst_host_serror_rate: 0.0,
  dst_host_srv_serror_rate: 0.0,
  dst_host_rerror_rate: 0.0,
  dst_host_srv_rerror_rate: 0.0
};


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