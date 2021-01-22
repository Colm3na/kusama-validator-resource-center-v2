GRANT ALL PRIVILEGES ON DATABASE vrc TO vrc;

CREATE TABLE IF NOT EXISTS block (  
  block_number BIGINT NOT NULL,
  block_author TEXT NOT NULL,
  block_author_name TEXT NOT NULL,
  block_hash TEXT NOT NULL,
  parent_hash TEXT NOT NULL,
  extrinsics_root TEXT NOT NULL,
  state_root TEXT NOT NULL,
  active_era BIGINT NOT NULL,
  session_index BIGINT NOT NULL,
  is_election BOOLEAN NOT NULL,
  total_events INT NOT NULL,
  total_extrinsics INT NOT NULL,
  timestamp BIGINT NOT NULL,
  PRIMARY KEY ( block_number )  
);

CREATE TABLE IF NOT EXISTS harvester_error (  
  block_number BIGINT NOT NULL,
  error TEXT NOT NULL,
  timestamp BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS event (  
  block_number BIGINT NOT NULL,
  event_index INT NOT NULL,
  section TEXT NOT NULL,
  method TEXT NOT NULL,
  phase TEXT NOT NULL,
  data TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  PRIMARY KEY ( block_number, event_index ) 
);

CREATE TABLE IF NOT EXISTS extrinsic (  
  block_number BIGINT NOT NULL,
  extrinsic_index INT NOT NULL,
  is_signed BOOLEAN NOT NULL,
  signer TEXT,
  section TEXT NOT NULL,
  method TEXT NOT NULL,
  args TEXT NOT NULL,
  hash TEXT NOT NULL,
  doc TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  timestamp BIGINT NOT NULL,
  PRIMARY KEY ( block_number, extrinsic_index ) 
);

CREATE TABLE IF NOT EXISTS validator (
  block_height BIGINT NOT NULL,
  active BOOLEAN NOT NULL,
  activeRating INT NOT NULL,
  name TEXT NOT NULL,
  identity TEXT NOT NULL,
  hasSubIdentity BOOLEAN NOT NULL,
  subAccountsRating INT NOT NULL,
  verifiedIdentity BOOLEAN NOT NULL,
  identityRating INT NOT NULL,
  stashAddress TEXT NOT NULL,
  controllerAddress TEXT NOT NULL,
  partOfCluster BOOLEAN NOT NULL,
  clusterName TEXT NOT NULL,
  clusterMembers TEXT NOT NULL,
  nominators INT NOT NULL,
  nominatorsRating INT NOT NULL,
  commission TEXT NOT NULL,
  commissionHistory TEXT NOT NULL,
  commissionRating INT NOT NULL,
  eraPointsHistory TEXT NOT NULL,
  eraPointsPercent TEXT NOT NULL,
  eraPointsRating INT NOT NULL,
  slashed BOOLEAN NOT NULL,
  slashRating INT NOT NULL,
  slashes TEXT NOT NULL,
  councilBacking BOOLEAN NOT NULL,
  activeInGovernance BOOLEAN NOT NULL,
  governanceRating INT NOT NULL,
  payoutHistory TEXT NOT NULL,
  payoutRating INT NOT NULL,
  selfStake BIGINT NOT NULL,
  otherStake BIGINT NOT NULL,
  totalStake BIGINT NOT NULL,
  totalRating INT NOT NULL,
  timestamp BIGINT NOT NULL,
  PRIMARY KEY ( block_height, stashAddress )
);

CREATE INDEX IF NOT EXISTS extrinsic_section_idx ON extrinsic (section);
CREATE INDEX IF NOT EXISTS extrinsic_method_idx ON extrinsic (method);
CREATE INDEX IF NOT EXISTS extrinsic_signer_idx ON extrinsic (signer);

GRANT ALL PRIVILEGES ON TABLE block TO vrc;
GRANT ALL PRIVILEGES ON TABLE harvester_error TO vrc;
GRANT ALL PRIVILEGES ON TABLE event TO vrc;
GRANT ALL PRIVILEGES ON TABLE extrinsic TO vrc;
GRANT ALL PRIVILEGES ON TABLE validator TO vrc;
