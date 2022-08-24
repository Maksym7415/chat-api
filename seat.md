<style>
table {
    border-collapse: collapse;
}
table, th, td {
   border: 1px solid black;
}
</style>

SEATMAP JSON REQUIREMENTS
-------------------------
## Base json structure
  * json should contain "entities" at the first nesting level
  * "entities" should be an array of objects

  E.g.
  ```
  {entities: [
    ...
  ]}
  ```
  * entities items should contain "type" property that might be one of **sectorBlock**, **pathBlock**, **titleBlock**, **entranceBlock**
  * "type" has type string

  E.g.
  ```
    {type: "sectorBlock" | "pathBlock" | "titleBlock" | "entranceBlock"}
  ```
  * entities should contain at least one child with sectorBlock type
### **1. sectorBlock**
  * description - contain all data relating to sector (rows, seats, zoomed in state graphics)
  * fields:

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | name | string | true | ORC-R |
    | id | number | true | 1 |
    | type | string | true | pathBlock |
    | x | number | false | 0 |
    | y | number | false | 0 |
    | rotation | number | false | 0 |
    | shape | string | true | path |
    | points | string | true | M330.2,51.5h216.2 |
    | label | object | false |
    | stroke | object | true |
    | fill | object | true |
    | entities | array | true |

    **label:**

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | visible | boolean | false | false|

    **stroke:**

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | color | string | true | #666666 |
    | opacity | number | true | 1 |
    | width | number | true | 1.0 |
    | linecap | string | true | round |
    | linejoin | string | true | round |

    **fill:**

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | color | string | true | #ffffff |
    | opacity | number | true | 1 |

  E.g.
  ```
  {
    "name": "ORC-R",
    "id": 1,
    "type": "sectorBlock",
    "x": 0,
    "y": 0,
    "rotation": 0,
    "points": "M15.8,4",
    "shape": "path",
    "label": {
      "visible": false
    },
    "stroke": {
      "color": "#666666",
      "opacity": 1,
      "width": 2.3612,
      "linecap": "round",
      "linejoin": "round"
    },
    "fill": {
      "color": "#4490E1",
      "opacity": 1
    },
    "entities": [
      ...
    ]
  }
  ```

  ### 1.1. sectorBlock entities
  * entities items should contain "type" property that might be one of **rowBlock**, **textBlock**, **pathBlock**
  * "type" has type string

  E.g.
  ```
    {type: "rowBlock" | "textBlock" | "pathBlock" }
  ```
  > **_NOTE:_**  should contain just one rowBlock item
  #### 1.1.1. rowBlock
  * fields:

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | id | number | true | 1 |
    | type | string | true | pathBlock |
    | x | number | false | 0 |
    | y | number | false | 0 |
    | name | string | true | ORC-R |
    | rotation | number | false | 0 |
    | labelPosition | string | false | none |
    | rows | array | true |

    E.g.
    ```
      {
        "id": 2,
        "type": "rowBlock",
        "x": 42.8,
        "y": 23.6,
        "name": "ORC-R",
        "rotation": 0,
        "lablePosition": "none",
        "radius": 0,
        "rows": [
          ...
        ]
      }
    ```

  * rows
    * fields:

      | Property | type | required | example | description |
      | :--- | :---: | :---: | :---: | :--- |
      | id | number | true | 1 |
      | name | string | true | C |
      | seats | array | true |

        > **_NOTE:_**  row "name" should match "text" in textBock to show correctly row names on the map and make them clickable
    
      E.g.
      ```
        {
          "id": 3,
          "name": "C",
          "seats": [
            ...
          ]
        }
      ```

  * row seats
    * fields:
      | Property | type | required | example | description |
      | :--- | :---: | :---: | :---: | :--- |
      | id | number | true | 1 |
      | name | string | true | 100 | name might have post fix "_w" or "_c" for defining wheelchairs and companion seats. E.g. "100_w" or "100_c" |
      | position | object | true |

      **position:**

      | Property | type | required | example | description |
      | :--- | :---: | :---: | :---: | :--- |
      | x | number | true | 203.9 |
      | y | number | true | 457.9 |
  
      E.g.
      ```
        {
          "id": 4,
          "name": "2",
          "position": {
            "x": 203.9,
            "y": 457.9
          }
        }
      ```

  #### 1.1.2. textBlock
  * fields:

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | type | string | true | textBlock |
    | id | number | true | 1 |
    | color | string | true | #666666 |
    | text | string | true | V |
    | rotation | number | false | 0 |
    | fontSize | string | true | 15.4043 |
    | x | number | true | 0 |
    | y | number | true | 0 |

    > **_NOTE:_**  "text" property should match row "name" property to make row title clickable

    E.g.
    ```
      {
        "type": "textBlock",
        "id": 136,
        "color": "#666666",
        "text": "V",
        "rotation": 0,
        "fontSize": "15.4043",
        "x": 8.6382,
        "y": 52.9189
      }
    ```

  #### 1.1.3. pathBlock
  * fields:

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | id | number | true | 1 |
    | type | string | true | pathBlock |
    | x | number | false | 0 |
    | y | number | false | 0 |
    | rotation | number | false | 0 |
    | points | string | true | M330.2,51.5h216.2 |
    | stroke | object | true |
    | fill | object | true |

    **stroke:**

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | color | string | true | #666666 |
    | opacity | number | true | 1 |
    | width | number | true | 1.0 |
    | linecap | string | true | round |
    | linejoin | string | true | round |

    **fill:**

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | color | string | true | #ffffff |
    | opacity | number | true | 1 |


    E.g.
    ```
      {
        "type": "pathBlock",
        "x": 0,
        "y": 0,
        "rotation": 0,
        "points": "M330.2,51.5h216.2c0.9,0,1.6-0.7,1.6-1.5V2.1c0-0.8-0.7-1.5-1.6-1.5H330.2c-0.9,0-1.6,0.7-1.6,1.5v47.8",
        "id": 490,
        "stroke": {
          "color": "#666666",
          "opacity": 1,
          "width": 1.0,
          "linecap": "round",
          "linejoin": "round"
        },
        "fill": {
          "color": "none",
          "opacity": 1
        }
      }
    ```

### **2. pathBlock**
  * description - contains just graphics for zoomed out sector state
  * fields:

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | id | number | true | 1 |
    | type | string | true | pathBlock |
    | x | number | false | 0 |
    | y | number | false | 0 |
    | rotation | number | false | 0 |
    | points | string | true | M330.2,51.5h216.2 |
    | stroke | object | true |
    | fill | object | true |

    **stroke:**

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | color | string | true | #666666 |
    | opacity | number | true | 1 |
    | width | number | true | 1.0 |
    | linecap | string | true | round |
    | linejoin | string | true | round |

    **fill:**

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | color | string | true | #ffffff |
    | opacity | number | true | 1 |

    E.g.

    ```
      {
        "type": "pathBlock",
        "x": 0,
        "y": 0,
        "rotation": 0,
        "points": "M1085.9,598.4v28.8c0,1.8-1.3,3.4-3.1,3.6c-174.",
        "id": 676,
        "stroke": {
          "color": "null",
          "opacity": 0,
          "width": 0,
          "linecap": "round",
          "linejoin": "round"
        },
        "fill": {
          "color": "#808080",
          "opacity": 1
        }
      }
    ```

### **3. titleBlock**
  * desctiption - sector's titles
  * fields:

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | type | string | true | textBlock |
    | id | number | true | 1 |
    | color | string | true | #666666 |
    | text | string | true | V |
    | rotation | number | false | 0 |
    | fontSize | string | true | 15.4043 |
    | x | number | true | 0 |
    | y | number | true | 0 |

    E.g.

    ```
      {
        "type": "titleBlock",
        "id": 674,
        "color": "#FFFFFF",
        "text": "ORCHESTRA",
        "rotation": 0,
        "fontSize": "18.4443",
        "x": 491.1885,
        "y": 246.9219
      }
    ```


### **4. entranceBlock**
  * desctiption - general admission sectors graphics
  * fields:

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | name | string | true | ORC-R |
    | id | number | true | 1 |
    | type | string | true | pathBlock |
    | x | number | false | 0 |
    | y | number | false | 0 |
    | rotation | number | false | 0 |
    | shape | string | true | path |
    | points | string | true | M330.2,51.5h216.2 |
    | label | object | false |
    | stroke | object | true |
    | fill | object | true |

    **label:**

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | visible | boolean | false | false|

    **stroke:**

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | color | string | true | #666666 |
    | opacity | number | true | 1 |
    | width | number | true | 1.0 |
    | linecap | string | true | round |
    | linejoin | string | true | round |

    **fill:**

    | Property | type | required | example | description |
    | :--- | :---: | :---: | :---: | :--- |
    | color | string | true | #ffffff |
    | opacity | number | true | 1 |

    E.g.

    ```
      {
        "id": 289,
        "name": "VIP2",
        "type": "entranceBlock",
        "x": 0,
        "y": 0,
        "rotation": 0,
        "label": {
          "visible": false
        },
        "points": "M2712.1,404.4c27.2-11.3,58.5,1.6,69.8,28.8c11.3,27.",
        "shape": "path",
        "stroke": {
          "color": "#808080",
          "opacity": 1,
          "width": 2.3619,
          "linecap": "round",
          "linejoin": "round"
        },
        "fill": {
          "color": "#A3D7D5",
          "opacity": 1
        }
      }
    ```

## Requirements to naming sectors, rows and seats
  Seat id in database consists of combination sector name, row name and seat name. Maximum length of seat id that we can save in database is 15 symbols. When backend parsing json file and defining seat id, there are adding addintional symbols "_" (for spliting sector's, row's and seat's names) and "_w" for indetifying wheelchair's seats or "_c" from companion seats. In result max length of combination sector name + row name + seat name should be max 11 symbols

  E.g.

  ```
    sectorName = ORC-L
    rowName = A
    seatName = 1

    seatId = "ORC-L_A_1_w" (when wheelchair seat)
    seatId = "ORC-L_A_1" (regular seat)
  ```
      
