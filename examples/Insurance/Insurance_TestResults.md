# Insurance Service Test Results

This document contains the actual testnet execution results for the Insurance Service example.

> **Execution Date**: 2026-06-10
> **Network**: Testnet
> **Account**: insurance_provider_v1 (0x52ae555b313bf4906df000218e87c9d26d916ff629bbaee3bfdf1c8454a8526f)

---

## Prerequisites

### 1. Create Insurance Provider Account

**Request**:
```json
{
  "gen": {
    "name": "insurance_provider_v1",
    "replaceExistName": true
  }
}
```

**Response**:
```json
{
  "gen": {
    "address": "0x52ae555b313bf4906df000218e87c9d26d916ff629bbaee3bfdf1c8454a8526f",
    "name": "insurance_provider_v1"
  }
}
```

---

### 2. Get Test Tokens

**Request**:
```json
{
  "faucet": {
    "network": "testnet",
    "name_or_address": "insurance_provider_v1"
  }
}
```

**Response**:
```json
{
  "faucet": {
    "name_or_address": "insurance_provider_v1",
    "result": [
      {
        "amount": 1000000000,
        "id": "0x90684a2990f83f51abbbff317457f4efafa8619954723e5e69072a1f7adb8b2d",
        "transferTxDigest": "5FetwozjKsEcMThgiJxVMqA8pYZzMCdVNUANhYokKWqd"
      },
      {
        "amount": 1000000000,
        "id": "0xc208c8b120695965d06cab4e3ebbc3b5b360830be5cbd900c04d6937da1910ef",
        "transferTxDigest": "5FetwozjKsEcMThgiJxVMqA8pYZzMCdVNUANhYokKWqd"
      },
      {
        "amount": 1000000000,
        "id": "0xec0ad61e089184255600ff7cf3f76a858529107f39b6716db6100160af9e3e7a",
        "transferTxDigest": "5FetwozjKsEcMThgiJxVMqA8pYZzMCdVNUANhYokKWqd"
      }
    ],
    "network": "testnet"
  }
}
```

---

## Step 1: Create Permission Object

**Request**:
```json
{
  "operation_type": "permission",
  "data": {
    "object": {
      "name": "insurance_permission_v1",
      "replaceExistName": true
    },
    "description": "Permission for outdoor accident insurance service",
    "table": {
      "op": "add perm by entity",
      "entity": {"name_or_address": "insurance_provider_v1"},
      "index": [1000, 1001, 1002, 1003, 1004, 1005]
    }
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Response**:
```json
[
  {
    "type": "TableItem_PermissionPerm",
    "type_raw": "0x2::dynamic_field::Field<address, 0x2::parent_linked_table::Node<address, vector<u16>>>",
    "object": "0x80f6fdd386012bb1b10762f978b8940f8434cc2963aa8fdbf0e8849d91a7c843",
    "version": "1272164",
    "owner": {"ObjectOwner": "0xc97f38d2ee4c0fafd2fb64b2b31708ac8b652a4e419c712f8fddb0d264402069"},
    "change": "created"
  },
  {
    "type": "Permission",
    "type_raw": "0x2::permission::Permission",
    "object": "0xc97f38d2ee4c0fafd2fb64b2b31708ac8b652a4e419c712f8fddb0d264402069",
    "version": "1272164",
    "owner": {"Shared": {"initial_shared_version": 1272164}},
    "change": "created"
  }
]
```

**Created Objects**:
- **Permission**: `0xc97f38d2ee4c0fafd2fb64b2b31708ac8b652a4e419c712f8fddb0d264402069`

---

## Step 2: Create Time-Lock Complete Guard

**Request**:
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "insurance_complete_guard_v1",
      "tags": ["insurance", "time-lock", "complete"],
      "replaceExistName": true
    },
    "description": "Time-lock guard for insurance claim completion. Requires current clock > progress.current_time + 1000ms (1 second for TESTING; in production set to reasonable duration like 8 hours). Progress is accessed via Order with convert_witness=TypeOrderProgress(100).",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "value": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "name": "Order ID (submitted at runtime)"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "U64",
        "value": 1000
      }
    ],
    "root": {
      "type": "logic_as_u256_greater",
      "nodes": [
        {
          "type": "context",
          "context": "Clock"
        },
        {
          "type": "calc_number_add",
          "nodes": [
            {
              "type": "query",
              "query": "progress.current_time",
              "object": {
                "identifier": 0,
                "convert_witness": 100
              },
              "parameters": []
            },
            {
              "type": "identifier",
              "identifier": 1
            }
          ]
        }
      ]
    }
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Response**:
```json
[
  {
    "type": "Guard",
    "type_raw": "0x2::guard::Guard",
    "object": "0x6de2d450eb16127d469d37147e9b9e803c4ae1915cc9ae6c91ec9e88c8832dce",
    "version": "1272404",
    "owner": "Immutable",
    "change": "created"
  }
]
```

**Created Objects**:
- **Guard**: `0x6de2d450eb16127d469d37147e9b9e803c4ae1915cc9ae6c91ec9e88c8832dce`

---

## Step 3: Create Withdraw Guard for Order Allocators

**Request**:
```json
{
  "operation_type": "guard",
  "data": {
    "namedNew": {
      "name": "insurance_withdraw_guard_v1",
      "tags": ["insurance", "withdraw"],
      "replaceExistName": true
    },
    "description": "Allow insurance provider to withdraw funds after order is completed.",
    "table": [
      {
        "identifier": 0,
        "b_submission": true,
        "value_type": "Address",
        "name": "order_id"
      },
      {
        "identifier": 1,
        "b_submission": false,
        "value_type": "String",
        "value": "Complete",
        "name": "complete_node"
      }
    ],
    "root": {
      "type": "logic_equal",
      "nodes": [
        {
          "type": "query",
          "query": "progress.current",
          "object": {
            "identifier": 0,
            "convert_witness": 100
          },
          "parameters": []
        },
        {
          "type": "identifier",
          "identifier": 1
        }
      ]
    }
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Response**:
```json
[
  {
    "type": "Guard",
    "type_raw": "0x2::guard::Guard",
    "object": "0xf03328cc50fd911deef72891da5614cea621cba3c489b07c11ce5355d2a9a6e4",
    "version": "1272608",
    "owner": "Immutable",
    "change": "created"
  }
]
```

**Created Objects**:
- **Guard**: `0xf03328cc50fd911deef72891da5614cea621cba3c489b07c11ce5355d2a9a6e4`

---

## Step 4: Create, Configure and Publish Machine

**Request**:
```json
{
  "operation_type": "machine",
  "data": {
    "object": {
      "name": "insurance_machine_v1",
      "permission": "insurance_permission_v1",
      "replaceExistName": true
    },
    "description": "Insurance claim processing workflow: Start -> Complete (with time-lock guard)",
    "node": {
      "op": "add",
      "nodes": [
        {
          "name": "Start",
          "pairs": [
            {
              "prev_node": "",
              "threshold": 0,
              "forwards": [
                {
                  "name": "start_claim",
                  "permissionIndex": 1000,
                  "weight": 1
                }
              ]
            }
          ]
        },
        {
          "name": "Complete",
          "pairs": [
            {
              "prev_node": "Start",
              "threshold": 1,
              "forwards": [
                {
                  "name": "complete_claim",
                  "permissionIndex": 1001,
                  "weight": 1,
                  "guard": {
                    "guard": "insurance_complete_guard_v1"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    "publish": true
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Response**:
```json
[
  {
    "type": "TableItem_EntityLinker",
    "type_raw": "0x2::dynamic_field::Field<address, 0x2::registrar::Votes>",
    "object": "0x6347a2522082a1da90a91752b4f0d93a7e8fd3f9e7ffd17a0fc7fcee6cfa7113",
    "version": "1272839",
    "owner": {"ObjectOwner": "0x0000000000000000000000000000000000000000000000000000000000000aaa"},
    "change": "created"
  },
  {
    "type": "TableItem_MachineNode",
    "type_raw": "0x2::dynamic_field::Field<0x1::string::String, 0x2::parent_linked_table::Node<0x1::string::String, vector<0x2::machine::NodePair>>>",
    "object": "0x7fadff337d8dca18f91edcfde124fdb1e3c0b381fcac114609947770ed610589",
    "version": "1272839",
    "owner": {"ObjectOwner": "0xfe59f4e474b5b2d38c627347fd663929a25a3211d645b650a3b0960223f0f1da"},
    "change": "created"
  },
  {
    "type": "TableItem_MachineNode",
    "type_raw": "0x2::dynamic_field::Field<0x1::string::String, 0x2::parent_linked_table::Node<0x1::string::String, vector<0x2::machine::NodePair>>>",
    "object": "0xb5c0d23287ca90e952d7928800ddd978c3a359dc254415dce1934f6187513e36",
    "version": "1272839",
    "owner": {"ObjectOwner": "0xfe59f4e474b5b2d38c627347fd663929a25a3211d645b650a3b0960223f0f1da"},
    "change": "created"
  },
  {
    "type": "Machine",
    "type_raw": "0x2::machine::Machine",
    "object": "0xfe59f4e474b5b2d38c627347fd663929a25a3211d645b650a3b0960223f0f1da",
    "version": "1272839",
    "owner": {"Shared": {"initial_shared_version": 1272839}},
    "change": "created"
  }
]
```

**Created Objects**:
- **Machine**: `0xfe59f4e474b5b2d38c627347fd663929a25a3211d645b650a3b0960223f0f1da`
- **Start Node**: `0x7fadff337d8dca18f91edcfde124fdb1e3c0b381fcac114609947770ed610589`
- **Complete Node**: `0xb5c0d23287ca90e952d7928800ddd978c3a359dc254415dce1934f6187513e36`

---

## Step 5: Create and Publish Service

**Request**:
```json
{
  "operation_type": "service",
  "data": {
    "object": {
      "name": "insurance_service_v1",
      "type_parameter": "0x2::wow::WOW",
      "permission": "insurance_permission_v1",
      "replaceExistName": true
    },
    "description": "Outdoor accident insurance for Iceland travel. Provides coverage for ice scooting and other outdoor activities.",
    "machine": "insurance_machine_v1",
    "order_allocators": {
      "description": "Insurance order revenue allocation",
      "threshold": 0,
      "allocators": [
        {
          "guard": "insurance_withdraw_guard_v1",
          "sharing": [
            {
              "who": {"Signer": "signer"},
              "sharing": 10000,
              "mode": "Rate"
            }
          ]
        }
      ]
    },
    "sales": {
      "op": "add",
      "sales": [
        {
          "name": "Outdoor Accident Insurance",
          "price": 100000000,
          "stock": 1000,
          "suspension": false,
          "wip": "",
          "wip_hash": ""
        }
      ]
    },
    "publish": true
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Response**:
```json
[
  {
    "type": "TableItem_EntityLinker",
    "type_raw": "0x2::dynamic_field::Field<address, 0x2::registrar::Votes>",
    "object": "0x6347a2522082a1da90a91752b4f0d93a7e8fd3f9e7ffd17a0fc7fcee6cfa7113",
    "version": "1273054",
    "owner": {"ObjectOwner": "0x0000000000000000000000000000000000000000000000000000000000000aaa"},
    "change": "mutated"
  },
  {
    "type": "TableItem_EntityLinker",
    "type_raw": "0x2::dynamic_field::Field<address, 0x2::registrar::Votes>",
    "object": "0x15f01d762deb2bc8976c4f78abd4d222c509054c70e5cd6a9e109596aa76e20d",
    "version": "1273054",
    "owner": {"ObjectOwner": "0x0000000000000000000000000000000000000000000000000000000000000aaa"},
    "change": "created"
  },
  {
    "type": "Service",
    "type_raw": "0x2::service::Service<0x2::wow::WOW>",
    "object": "0x3cd3240476aaca35f58d07bdd58312d6ee4a1ca782cf878d3481350b2a72342a",
    "version": "1273054",
    "owner": {"Shared": {"initial_shared_version": 1273054}},
    "change": "created"
  }
]
```

**Created Objects**:
- **Service**: `0x3cd3240476aaca35f58d07bdd58312d6ee4a1ca782cf878d3481350b2a72342a`

---

## Step 6: Unpause Service

**Request**:
```json
{
  "operation_type": "service",
  "data": {
    "object": "insurance_service_v1",
    "pause": false
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Response**:
```json
[
  {
    "type": "Service",
    "type_raw": "0x2::service::Service<0x2::wow::WOW>",
    "object": "0x3cd3240476aaca35f58d07bdd58312d6ee4a1ca782cf878d3481350b2a72342a",
    "version": "1273233",
    "owner": {"Shared": {"initial_shared_version": 1273054}},
    "change": "mutated"
  }
]
```

---

## Step 7: Create Test Order

**Request**:
```json
{
  "operation_type": "service",
  "data": {
    "object": "insurance_service_v1",
    "order_new": {
      "buy": {
        "items": [
          {
            "name": "Outdoor Accident Insurance",
            "stock": 1,
            "wip_hash": ""
          }
        ],
        "total_pay": {
          "balance": 100000000
        }
      },
      "namedNewOrder": {
        "name": "test_insurance_order_v1",
        "replaceExistName": true
      }
    }
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Response**:
```json
[
  {
    "type": "TableItem_EntityLinker",
    "type_raw": "0x2::dynamic_field::Field<address, 0x2::registrar::Votes>",
    "object": "0x15f01d762deb2bc8976c4f78abd4d222c509054c70e5cd6a9e109596aa76e20d",
    "version": "1273412",
    "owner": {"ObjectOwner": "0x0000000000000000000000000000000000000000000000000000000000000aaa"},
    "change": "mutated"
  },
  {
    "type": "Service",
    "type_raw": "0x2::service::Service<0x2::wow::WOW>",
    "object": "0x3cd3240476aaca35f58d07bdd58312d6ee4a1ca782cf878d3481350b2a72342a",
    "version": "1273412",
    "owner": {"Shared": {"initial_shared_version": 1273054}},
    "change": "mutated"
  },
  {
    "type": "Progress",
    "type_raw": "0x2::progress::Progress",
    "object": "0x14b58995e9d5ef8b40847f0f96fa52ba916b910f7f8e041d7e8e77bd41c318a2",
    "version": "1273412",
    "owner": {"Shared": {"initial_shared_version": 1273412}},
    "change": "created"
  },
  {
    "type": "TableItem_EntityLinker",
    "type_raw": "0x2::dynamic_field::Field<address, 0x2::registrar::Votes>",
    "object": "0x3e6751e25512c8acb4f5b7877eb34e9c8309e4cb8afac475fd39168f051062d4",
    "version": "1273412",
    "owner": {"ObjectOwner": "0x0000000000000000000000000000000000000000000000000000000000000aaa"},
    "change": "created"
  },
  {
    "type": "Order",
    "type_raw": "0x2::order::Order",
    "object": "0x5143e0d98cd26482c4d53053f81d693e11d7f65356696a2f5a7fb33b0829a36a",
    "version": "1273412",
    "owner": {"Shared": {"initial_shared_version": 1273412}},
    "change": "created"
  },
  {
    "type": "TableItem_EntityLinker",
    "type_raw": "0x2::dynamic_field::Field<address, 0x2::registrar::Votes>",
    "object": "0x6d2ef54b75ffd021b2a1482e6c7b3a9b84b340fab21c4a00e95433fc0250dabf",
    "version": "1273412",
    "owner": {"ObjectOwner": "0x0000000000000000000000000000000000000000000000000000000000000aaa"},
    "change": "created"
  },
  {
    "type": "Allocation",
    "type_raw": "0x2::allocation::Allocation<0x2::wow::WOW>",
    "object": "0xa0db24ead389f9ae2673fa449b23644c92d586f5a352efb927e3e7db04203436",
    "version": "1273412",
    "owner": {"Shared": {"initial_shared_version": 1273412}},
    "change": "created"
  }
]
```

**Created Objects**:
- **Order**: `0x5143e0d98cd26482c4d53053f81d693e11d7f65356696a2f5a7fb33b0829a36a`
- **Progress**: `0x14b58995e9d5ef8b40847f0f96fa52ba916b910f7f8e041d7e8e77bd41c318a2`
- **Allocation**: `0xa0db24ead389f9ae2673fa449b23644c92d586f5a352efb927e3e7db04203436`

---

## Step 8: Advance Progress - Initial to Start

**Request**:
```json
{
  "operation_type": "progress",
  "data": {
    "object": "0x14b58995e9d5ef8b40847f0f96fa52ba916b910f7f8e041d7e8e77bd41c318a2",
    "operate": {
      "operation": {
        "next_node_name": "Start",
        "forward": "start_claim"
      }
    }
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Response**:
```json
[
  {
    "type": "Progress",
    "type_raw": "0x2::progress::Progress",
    "object": "0x14b58995e9d5ef8b40847f0f96fa52ba916b910f7f8e041d7e8e77bd41c318a2",
    "version": "1273871",
    "owner": {"Shared": {"initial_shared_version": 1273412}},
    "change": "mutated"
  },
  {
    "type": "TableItem_ProgressHistory",
    "type_raw": "0x2::dynamic_field::Field<u64, 0x2::progress::History>",
    "object": "0x63e1a30afe299e198ddf3bd85aeb465226d757cfd530f750bbc6b4b88276d11b",
    "version": "1273871",
    "owner": {"ObjectOwner": "0x14b58995e9d5ef8b40847f0f96fa52ba916b910f7f8e041d7e8e77bd41c318a2"},
    "change": "created"
  }
]
```

---

## Summary of Created Objects

| Object Type | Name | Object ID |
|-------------|------|-----------|
| Account | insurance_provider_v1 | 0x52ae555b313bf4906df000218e87c9d26d916ff629bbaee3bfdf1c8454a8526f |
| Permission | insurance_permission_v1 | 0xc97f38d2ee4c0fafd2fb64b2b31708ac8b652a4e419c712f8fddb0d264402069 |
| Guard | insurance_complete_guard_v1 | 0x6de2d450eb16127d469d37147e9b9e803c4ae1915cc9ae6c91ec9e88c8832dce |
| Guard | insurance_withdraw_guard_v1 | 0xf03328cc50fd911deef72891da5614cea621cba3c489b07c11ce5355d2a9a6e4 |
| Machine | insurance_machine_v1 | 0xfe59f4e474b5b2d38c627347fd663929a25a3211d645b650a3b0960223f0f1da |
| Service | insurance_service_v1 | 0x3cd3240476aaca35f58d07bdd58312d6ee4a1ca782cf878d3481350b2a72342a |
| Order | test_insurance_order_v1 | 0x5143e0d98cd26482c4d53053f81d693e11d7f65356696a2f5a7fb33b0829a36a |
| Progress | (associated with order) | 0x14b58995e9d5ef8b40847f0f96fa52ba916b910f7f8e041d7e8e77bd41c318a2 |
| Allocation | (associated with order) | 0xa0db24ead389f9ae2673fa449b23644c92d586f5a352efb927e3e7db04203436 |

---

## Issues Found and Corrections

### Issue 1: Progress Operation Schema

**Original Documentation Issue**:
The original documentation showed progress operation with only `forward` field:
```json
{
  "operation": {
    "forward": "start_claim"
  }
}
```

**Correction**:
The actual schema requires BOTH `next_node_name` and `forward` fields:
```json
{
  "operation": {
    "next_node_name": "Start",
    "forward": "start_claim"
  }
}
```

### Issue 2: Progress Object Reference

**Original Documentation Issue**:
The documentation suggested using the order name to reference the progress:
```json
{
  "object": "test_insurance_order_v1"
}
```

**Correction**:
The progress operation requires the actual Progress object ID, not the order name. The Progress object ID can be obtained from the order query:
```json
{
  "object": "0x14b58995e9d5ef8b40847f0f96fa52ba916b910f7f8e041d7e8e77bd41c318a2"
}
```

Or you can query the order first to get the progress ID:
```json
{
  "query_type": "onchain_objects",
  "objects": ["test_insurance_order_v1"]
}
```
The response will contain the `progress` field with the Progress object ID.

---

## Next Steps (Not Executed)

To complete the test, you would need to:

1. **Wait at least 1 second** after entering the Start node
2. **Advance Progress from Start to Complete** with the Order ID as submission

**Request**:
```json
{
  "operation_type": "progress",
  "data": {
    "object": "0x14b58995e9d5ef8b40847f0f96fa52ba916b910f7f8e041d7e8e77bd41c318a2",
    "operate": {
      "operation": {
        "next_node_name": "Complete",
        "forward": "complete_claim"
      }
    }
  },
  "submission": {
    "type": "submission",
    "guard": [
      {
        "object": "insurance_complete_guard_v1",
        "impack": true
      }
    ],
    "submission": [
      {
        "guard": "insurance_complete_guard_v1",
        "submission": [
          {
            "identifier": 0,
            "b_submission": true,
            "value_type": "Address",
            "value": "0x5143e0d98cd26482c4d53053f81d693e11d7f65356696a2f5a7fb33b0829a36a"
          }
        ]
      }
    ]
  },
  "env": {
    "account": "insurance_provider_v1",
    "network": "testnet"
  }
}
```

**Note**: This final step requires waiting for the time-lock (1 second) to pass before the Guard will allow the transition to Complete.
