# Machine Node Definition

**Machine:** myshop_advanced_machine_v2

**Address:** 0x92438d89ade425c538d02e2a3154607f82446d37ba0a62ed883ff8d89b1a8283

**ID:** 0x92438d89ade425c538d02e2a3154607f82446d37ba0a62ed883ff8d89b1a8283

**Total Nodes:** 10

---

## Node: Delivery Complete

### Pair: Shipping

- **prev_node**: Shipping
- **threshold**: 1

#### Forwards

| name | weight | namedOperator | permissionIndex | guard |
|------|--------|---------------|-----------------|-------|
| Confirm Receipt | 1 |  |  |  |

---

## Node: Shipping

### Pair: Order Confirmed

- **prev_node**: Order Confirmed
- **threshold**: 1

#### Forwards

| name | weight | namedOperator | permissionIndex | guard |
|------|--------|---------------|-----------------|-------|
| Confirm Signature and Submit Merkle Root | 1 |  | 1001 | 0xd333beacc860a19eca5ca5995a645b55612010ac09527f4417ef4341c387fcac |

---

## Node: Order Complete

### Pair: Delivery Complete

- **prev_node**: Delivery Complete
- **threshold**: 1

#### Forwards

| name | weight | namedOperator | permissionIndex | guard |
|------|--------|---------------|-----------------|-------|
| Complete Order | 1 |  | 1001 |  |

### Pair: Shipping

- **prev_node**: Shipping
- **threshold**: 1

#### Forwards

| name | weight | namedOperator | permissionIndex | guard |
|------|--------|---------------|-----------------|-------|
| Auto Complete from Shipping | 1 |  | 1001 | 0xe59e6ef554fc81c61608b49ce172244bcce41f4f51489beced2dfb863df1f40b |

---

## Node: Return Complete

### Pair: Receipt Return

- **prev_node**: Receipt Return
- **threshold**: 2

#### Forwards

| name | weight | namedOperator | permissionIndex | guard |
|------|--------|---------------|-----------------|-------|
| Submit Return Merkle Root | 1 |  |  | 0xd333beacc860a19eca5ca5995a645b55612010ac09527f4417ef4341c387fcac |
| Confirm Return Received | 1 |  | 1001 |  |

### Pair: Non-receipt Return

- **prev_node**: Non-receipt Return
- **threshold**: 2

#### Forwards

| name | weight | namedOperator | permissionIndex | guard |
|------|--------|---------------|-----------------|-------|
| Submit Return Merkle Root | 1 |  |  | 0xd333beacc860a19eca5ca5995a645b55612010ac09527f4417ef4341c387fcac |
| Confirm Return Received | 1 |  | 1001 |  |

---

## Node: Receipt Return

### Pair: Delivery Complete

- **prev_node**: Delivery Complete
- **threshold**: 2

#### Forwards

| name | weight | namedOperator | permissionIndex | guard |
|------|--------|---------------|-----------------|-------|
| Request Return with Receipt | 1 |  |  |  |
| Confirm Return Address with Merkle Root | 1 |  | 1001 | 0xd333beacc860a19eca5ca5995a645b55612010ac09527f4417ef4341c387fcac |

---

## Node: Order Confirmed

### Pair: 

- **prev_node**: 
- **threshold**: 1

#### Forwards

| name | weight | namedOperator | permissionIndex | guard |
|------|--------|---------------|-----------------|-------|
| Confirm Order | 1 |  | 1000 |  |

---

## Node: Wonderful

### Pair: Delivery Complete

- **prev_node**: Delivery Complete
- **threshold**: 1

#### Forwards

| name | weight | namedOperator | permissionIndex | guard |
|------|--------|---------------|-----------------|-------|
| Rate as Wonderful | 1 |  |  |  |

---

## Node: Return Fail

### Pair: Receipt Return

- **prev_node**: Receipt Return
- **threshold**: 1

#### Forwards

| name | weight | namedOperator | permissionIndex | guard |
|------|--------|---------------|-----------------|-------|
| Timeout Return Not Received | 1 |  | 1001 | 0xe59e6ef554fc81c61608b49ce172244bcce41f4f51489beced2dfb863df1f40b |

---

## Node: Lost

### Pair: Shipping

- **prev_node**: Shipping
- **threshold**: 2

#### Forwards

| name | weight | namedOperator | permissionIndex | guard |
|------|--------|---------------|-----------------|-------|
| Report Lost | 1 |  |  |  |
| Confirm Lost with Merkle Root | 1 |  | 1001 | 0xd333beacc860a19eca5ca5995a645b55612010ac09527f4417ef4341c387fcac |

---

## Node: Non-receipt Return

### Pair: Shipping

- **prev_node**: Shipping
- **threshold**: 2

#### Forwards

| name | weight | namedOperator | permissionIndex | guard |
|------|--------|---------------|-----------------|-------|
| Request Return | 1 |  |  |  |
| Confirm Return with Merkle Root | 1 |  | 1001 | 0xd333beacc860a19eca5ca5995a645b55612010ac09527f4417ef4341c387fcac |

---

## JSON Definition

```json
[
  {
    "name": "Delivery Complete",
    "pairs": [
      {
        "prev_node": "Shipping",
        "threshold": 1,
        "forwards": [
          {
            "name": "Confirm Receipt",
            "weight": 1,
            "namedOperator": "",
            "permissionIndex": null
          }
        ]
      }
    ]
  },
  {
    "name": "Shipping",
    "pairs": [
      {
        "prev_node": "Order Confirmed",
        "threshold": 1,
        "forwards": [
          {
            "name": "Confirm Signature and Submit Merkle Root",
            "weight": 1,
            "namedOperator": null,
            "permissionIndex": 1001,
            "guard": {
              "guard": "0xd333beacc860a19eca5ca5995a645b55612010ac09527f4417ef4341c387fcac",
              "retained_submission": []
            }
          }
        ]
      }
    ]
  },
  {
    "name": "Order Complete",
    "pairs": [
      {
        "prev_node": "Delivery Complete",
        "threshold": 1,
        "forwards": [
          {
            "name": "Complete Order",
            "weight": 1,
            "namedOperator": null,
            "permissionIndex": 1001
          }
        ]
      },
      {
        "prev_node": "Shipping",
        "threshold": 1,
        "forwards": [
          {
            "name": "Auto Complete from Shipping",
            "weight": 1,
            "namedOperator": null,
            "permissionIndex": 1001,
            "guard": {
              "guard": "0xe59e6ef554fc81c61608b49ce172244bcce41f4f51489beced2dfb863df1f40b",
              "retained_submission": []
            }
          }
        ]
      }
    ]
  },
  {
    "name": "Return Complete",
    "pairs": [
      {
        "prev_node": "Receipt Return",
        "threshold": 2,
        "forwards": [
          {
            "name": "Submit Return Merkle Root",
            "weight": 1,
            "namedOperator": "",
            "permissionIndex": null,
            "guard": {
              "guard": "0xd333beacc860a19eca5ca5995a645b55612010ac09527f4417ef4341c387fcac",
              "retained_submission": []
            }
          },
          {
            "name": "Confirm Return Received",
            "weight": 1,
            "namedOperator": null,
            "permissionIndex": 1001
          }
        ]
      },
      {
        "prev_node": "Non-receipt Return",
        "threshold": 2,
        "forwards": [
          {
            "name": "Submit Return Merkle Root",
            "weight": 1,
            "namedOperator": "",
            "permissionIndex": null,
            "guard": {
              "guard": "0xd333beacc860a19eca5ca5995a645b55612010ac09527f4417ef4341c387fcac",
              "retained_submission": []
            }
          },
          {
            "name": "Confirm Return Received",
            "weight": 1,
            "namedOperator": null,
            "permissionIndex": 1001
          }
        ]
      }
    ]
  },
  {
    "name": "Receipt Return",
    "pairs": [
      {
        "prev_node": "Delivery Complete",
        "threshold": 2,
        "forwards": [
          {
            "name": "Request Return with Receipt",
            "weight": 1,
            "namedOperator": "",
            "permissionIndex": null
          },
          {
            "name": "Confirm Return Address with Merkle Root",
            "weight": 1,
            "namedOperator": null,
            "permissionIndex": 1001,
            "guard": {
              "guard": "0xd333beacc860a19eca5ca5995a645b55612010ac09527f4417ef4341c387fcac",
              "retained_submission": []
            }
          }
        ]
      }
    ]
  },
  {
    "name": "Order Confirmed",
    "pairs": [
      {
        "prev_node": "",
        "threshold": 1,
        "forwards": [
          {
            "name": "Confirm Order",
            "weight": 1,
            "namedOperator": null,
            "permissionIndex": 1000
          }
        ]
      }
    ]
  },
  {
    "name": "Wonderful",
    "pairs": [
      {
        "prev_node": "Delivery Complete",
        "threshold": 1,
        "forwards": [
          {
            "name": "Rate as Wonderful",
            "weight": 1,
            "namedOperator": "",
            "permissionIndex": null
          }
        ]
      }
    ]
  },
  {
    "name": "Return Fail",
    "pairs": [
      {
        "prev_node": "Receipt Return",
        "threshold": 1,
        "forwards": [
          {
            "name": "Timeout Return Not Received",
            "weight": 1,
            "namedOperator": null,
            "permissionIndex": 1001,
            "guard": {
              "guard": "0xe59e6ef554fc81c61608b49ce172244bcce41f4f51489beced2dfb863df1f40b",
              "retained_submission": []
            }
          }
        ]
      }
    ]
  },
  {
    "name": "Lost",
    "pairs": [
      {
        "prev_node": "Shipping",
        "threshold": 2,
        "forwards": [
          {
            "name": "Report Lost",
            "weight": 1,
            "namedOperator": "",
            "permissionIndex": null
          },
          {
            "name": "Confirm Lost with Merkle Root",
            "weight": 1,
            "namedOperator": null,
            "permissionIndex": 1001,
            "guard": {
              "guard": "0xd333beacc860a19eca5ca5995a645b55612010ac09527f4417ef4341c387fcac",
              "retained_submission": []
            }
          }
        ]
      }
    ]
  },
  {
    "name": "Non-receipt Return",
    "pairs": [
      {
        "prev_node": "Shipping",
        "threshold": 2,
        "forwards": [
          {
            "name": "Request Return",
            "weight": 1,
            "namedOperator": "",
            "permissionIndex": null
          },
          {
            "name": "Confirm Return with Merkle Root",
            "weight": 1,
            "namedOperator": null,
            "permissionIndex": 1001,
            "guard": {
              "guard": "0xd333beacc860a19eca5ca5995a645b55612010ac09527f4417ef4341c387fcac",
              "retained_submission": []
            }
          }
        ]
      }
    ]
  }
]
```
