import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import "./App.css";

const PROJECT_FILE = "skyskript-project.json";

type NotificationType = "success" | "error" | "info";

function registerBlocks() {
  // =========================================================
  // VALUE BLOCKS
  // =========================================================

  Blockly.Blocks["skript_text"] = {
    init() {
      this.appendDummyInput()
        .appendField("文字")
        .appendField(
          new Blockly.FieldTextInput("Hello"),
          "TEXT"
        );

      this.setOutput(true, "String");
      this.setColour(200);
    },
  };

  Blockly.Blocks["skript_number"] = {
    init() {
      this.appendDummyInput()
        .appendField("数値")
        .appendField(
          new Blockly.FieldNumber(10),
          "NUMBER"
        );

      this.setOutput(true, "Number");
      this.setColour(200);
    },
  };

  Blockly.Blocks["skript_item"] = {
    init() {
      this.appendDummyInput()
        .appendField("アイテム")
        .appendField(
          new Blockly.FieldTextInput("diamond"),
          "ITEM"
        );

      this.setOutput(true, "String");
      this.setColour(200);
    },
  };

  Blockly.Blocks["skript_block"] = {
    init() {
      this.appendDummyInput()
        .appendField("ブロック")
        .appendField(
          new Blockly.FieldTextInput("diamond_ore"),
          "BLOCK"
        );

      this.setOutput(true, "String");
      this.setColour(200);
    },
  };

  Blockly.Blocks["skript_entity"] = {
    init() {
      this.appendDummyInput()
        .appendField("エンティティ")
        .appendField(
          new Blockly.FieldTextInput("zombie"),
          "ENTITY"
        );

      this.setOutput(true, "String");
      this.setColour(200);
    },
  };

  Blockly.Blocks["skript_location"] = {
    init() {
      this.appendDummyInput()
        .appendField("座標")
        .appendField(
          new Blockly.FieldTextInput("world, 0, 64, 0"),
          "LOCATION"
        );

      this.setOutput(true, "String");
      this.setColour(200);
    },
  };

  // =========================================================
  // SKRIPT CONTEXT
  // =========================================================

  const contextValues = [
    ["player", "player"],
    ["event-player", "event-player"],
    ["loop-player", "loop-player"],
    ["victim", "victim"],
    ["attacker", "attacker"],
    ["event-block", "event-block"],
    ["event-item", "event-item"],
    ["event-entity", "event-entity"],
    ["event-damage", "event-damage"],
    ["event-message", "event-message"],
    ["world", "world"],
    ["location", "location"],
  ];

  for (const [type, value] of contextValues) {
    const blockType =
      `skript_context_${type.replace("-", "_")}`;

    Blockly.Blocks[blockType] = {
      init() {
        this.appendDummyInput()
          .appendField(value);

        if (
          value === "event-damage"
        ) {
          this.setOutput(true, "Number");
        } else {
          this.setOutput(true, "String");
        }

        this.setColour(160);
      },
    };
  }

  // =========================================================
  // EVENTS
  // =========================================================

  const eventDefinitions = [
    ["skript_event_join", "on join:"],
    ["skript_event_quit", "on quit:"],
    ["skript_event_chat", "on chat:"],
    ["skript_event_break", "on break:"],
    ["skript_event_place", "on place:"],
    ["skript_event_damage", "on damage:"],
    ["skript_event_death", "on death:"],
    ["skript_event_respawn", "on respawn:"],
    [
      "skript_event_right_click",
      "on right click:",
    ],
    [
      "skript_event_left_click",
      "on left click:",
    ],
    [
      "skript_event_interact",
      "on player interact:",
    ],
    [
      "skript_event_inventory_click",
      "on inventory click:",
    ],
  ];

  for (const [type, text] of eventDefinitions) {
    Blockly.Blocks[type] = {
      init() {
        this.appendDummyInput()
          .appendField(text);

        this.appendStatementInput("DO")
          .appendField("実行");

        this.setColour(120);
      },
    };
  }

  // =========================================================
  // COMMAND
  // =========================================================

  Blockly.Blocks["skript_command"] = {
    init() {
      this.appendDummyInput()
        .appendField("/")
        .appendField(
          new Blockly.FieldTextInput("hello"),
          "COMMAND"
        );

      this.appendStatementInput("DO")
        .appendField("実行");

      this.setColour(10);
    },
  };

  // =========================================================
  // PLAYER EFFECTS
  // =========================================================

  Blockly.Blocks["skript_send"] = {
    init() {
      this.appendValueInput("MESSAGE")
        .setCheck("String")
        .appendField("メッセージ");

      this.appendDummyInput()
        .appendField("を player に送る");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(210);
    },
  };

  Blockly.Blocks["skript_broadcast"] = {
    init() {
      this.appendValueInput("MESSAGE")
        .setCheck("String")
        .appendField("全員に");

      this.appendDummyInput()
        .appendField("メッセージを送る");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(210);
    },
  };

  Blockly.Blocks["skript_title"] = {
    init() {
      this.appendValueInput("TITLE")
        .setCheck("String")
        .appendField("タイトル");

      this.appendValueInput("SUBTITLE")
        .setCheck("String")
        .appendField("サブタイトル");

      this.appendDummyInput()
        .appendField("を player に表示");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(210);
    },
  };

  Blockly.Blocks["skript_actionbar"] = {
    init() {
      this.appendValueInput("MESSAGE")
        .setCheck("String")
        .appendField("アクションバー");

      this.appendDummyInput()
        .appendField("を player に表示");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(210);
    },
  };

  Blockly.Blocks["skript_give"] = {
    init() {
      this.appendValueInput("AMOUNT")
        .setCheck("Number")
        .appendField("player に");

      this.appendValueInput("ITEM")
        .setCheck("String")
        .appendField("個");

      this.appendDummyInput()
        .appendField("アイテムを与える");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(210);
    },
  };

  Blockly.Blocks["skript_remove"] = {
    init() {
      this.appendValueInput("AMOUNT")
        .setCheck("Number")
        .appendField("player から");

      this.appendValueInput("ITEM")
        .setCheck("String")
        .appendField("個");

      this.appendDummyInput()
        .appendField("アイテムを削除");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(210);
    },
  };

  Blockly.Blocks["skript_heal"] = {
    init() {
      this.appendValueInput("AMOUNT")
        .setCheck("Number")
        .appendField("player を");

      this.appendDummyInput()
        .appendField("回復");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(210);
    },
  };

  Blockly.Blocks["skript_damage"] = {
    init() {
      this.appendValueInput("AMOUNT")
        .setCheck("Number")
        .appendField("player に");

      this.appendDummyInput()
        .appendField("ダメージ");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(210);
    },
  };

  Blockly.Blocks["skript_teleport_spawn"] = {
    init() {
      this.appendDummyInput()
        .appendField(
          "player を spawn にテレポート"
        );

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(210);
    },
  };

  Blockly.Blocks["skript_teleport_location"] = {
    init() {
      this.appendValueInput("LOCATION")
        .setCheck("String")
        .appendField(
          "player を"
        );

      this.appendDummyInput()
        .appendField("へテレポート");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(210);
    },
  };

  Blockly.Blocks["skript_kick"] = {
    init() {
      this.appendValueInput("REASON")
        .setCheck("String")
        .appendField("player をキック");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(210);
    },
  };

  Blockly.Blocks["skript_kill"] = {
    init() {
      this.appendDummyInput()
        .appendField("player をキル");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(210);
    },
  };

  // =========================================================
  // SOUND
  // =========================================================

  Blockly.Blocks["skript_sound"] = {
    init() {
      this.appendDummyInput()
        .appendField("player にサウンド")
        .appendField(
          new Blockly.FieldTextInput(
            "entity.player.levelup"
          ),
          "SOUND"
        );

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(230);
    },
  };

  // =========================================================
  // GAME MODE
  // =========================================================

  Blockly.Blocks["skript_gamemode"] = {
    init() {
      this.appendDummyInput()
        .appendField("player のゲームモードを")
        .appendField(
          new Blockly.FieldDropdown([
            ["survival", "survival"],
            ["creative", "creative"],
            ["adventure", "adventure"],
            ["spectator", "spectator"],
          ]),
          "MODE"
        )
        .appendField("にする");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(230);
    },
  };

  Blockly.Blocks["skript_fly"] = {
    init() {
      this.appendDummyInput()
        .appendField("player の飛行を")
        .appendField(
          new Blockly.FieldDropdown([
            ["有効", "true"],
            ["無効", "false"],
          ]),
          "VALUE"
        );

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(230);
    },
  };

  // =========================================================
  // IF
  // =========================================================

  Blockly.Blocks["skript_if"] = {
    init() {
      this.appendDummyInput()
        .appendField("if");

      this.appendDummyInput()
        .appendField(
          new Blockly.FieldDropdown([
            ["権限", "permission"],
            ["体力", "health"],
            ["アイテム", "item"],
            ["ブロック", "block"],
            ["エンティティ", "entity"],
            ["変数", "variable"],
            ["所持金", "money"],
            ["プレイヤー", "player"],
            ["Skript値", "context"],
            ["しゃがんでいる", "sneaking"],
            ["走っている", "sprinting"],
            ["泳いでいる", "swimming"],
            ["オンライン", "online"],
            ["確率", "chance"],
          ]),
          "TYPE"
        );

      this.appendDummyInput()
        .appendField(
          new Blockly.FieldDropdown([
            ["=", "EQUAL"],
            ["≠", "NOT_EQUAL"],
            [">", "GREATER"],
            ["<", "LESS"],
            [">=", "GREATER_EQUAL"],
            ["<=", "LESS_EQUAL"],
          ]),
          "OP"
        );

      this.appendValueInput("VALUE")
        .setCheck(null)
        .appendField("値");

      this.appendStatementInput("DO")
        .appendField("実行");

      this.setPreviousStatement(true);
      this.setNextStatement(true);

      this.setColour(45);
    },
  };

  // =========================================================
  // ELSE
  // =========================================================

  Blockly.Blocks["skript_else"] = {
    init() {
      this.appendDummyInput()
        .appendField("else");

      this.appendStatementInput("DO")
        .appendField("実行");

      this.setPreviousStatement(true);
      this.setNextStatement(true);

      this.setColour(45);
    },
  };

  // =========================================================
  // VARIABLES
  // =========================================================

  Blockly.Blocks["skript_set_variable"] = {
    init() {
      this.appendDummyInput()
        .appendField("変数")
        .appendField(
          new Blockly.FieldTextInput("coins"),
          "VAR"
        );

      this.appendValueInput("VALUE")
        .setCheck(null)
        .appendField("を");

      this.appendDummyInput()
        .appendField("に設定");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(55);
    },
  };

  Blockly.Blocks["skript_add_variable"] = {
    init() {
      this.appendDummyInput()
        .appendField("変数")
        .appendField(
          new Blockly.FieldTextInput("coins"),
          "VAR"
        );

      this.appendValueInput("VALUE")
        .setCheck("Number")
        .appendField("に");

      this.appendDummyInput()
        .appendField("加算");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(55);
    },
  };

  Blockly.Blocks["skript_remove_variable"] = {
    init() {
      this.appendDummyInput()
        .appendField("変数")
        .appendField(
          new Blockly.FieldTextInput("coins"),
          "VAR"
        );

      this.appendValueInput("VALUE")
        .setCheck("Number")
        .appendField("から");

      this.appendDummyInput()
        .appendField("減算");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(55);
    },
  };

  Blockly.Blocks["skript_delete_variable"] = {
    init() {
      this.appendDummyInput()
        .appendField("変数")
        .appendField(
          new Blockly.FieldTextInput("coins"),
          "VAR"
        )
        .appendField("を削除");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(55);
    },
  };

  // =========================================================
  // LOOPS
  // =========================================================

  Blockly.Blocks["skript_loop_players"] = {
    init() {
      this.appendDummyInput()
        .appendField(
          "全プレイヤーをループ"
        );

      this.appendStatementInput("DO")
        .appendField("実行");

      this.setPreviousStatement(true);
      this.setNextStatement(true);

      this.setColour(290);
    },
  };

  Blockly.Blocks["skript_loop_nearby_players"] = {
    init() {
      this.appendValueInput("DISTANCE")
        .setCheck("Number")
        .appendField(
          "近くのプレイヤーを"
        );

      this.appendDummyInput()
        .appendField("ブロック以内でループ");

      this.appendStatementInput("DO")
        .appendField("実行");

      this.setPreviousStatement(true);
      this.setNextStatement(true);

      this.setColour(290);
    },
  };

  Blockly.Blocks["skript_loop_entities"] = {
    init() {
      this.appendDummyInput()
        .appendField(
          "近くのエンティティをループ"
        );

      this.appendStatementInput("DO")
        .appendField("実行");

      this.setPreviousStatement(true);
      this.setNextStatement(true);

      this.setColour(290);
    },
  };

  Blockly.Blocks["skript_loop_number"] = {
    init() {
      this.appendValueInput("COUNT")
        .setCheck("Number")
        .appendField("指定回数");

      this.appendStatementInput("DO")
        .appendField("実行");

      this.setPreviousStatement(true);
      this.setNextStatement(true);

      this.setColour(290);
    },
  };

  Blockly.Blocks["skript_loop_while"] = {
    init() {
      this.appendDummyInput()
        .appendField("while");

      this.appendValueInput("CONDITION")
        .setCheck(null);

      this.appendStatementInput("DO")
        .appendField("実行");

      this.setPreviousStatement(true);
      this.setNextStatement(true);

      this.setColour(290);
    },
  };

  // =========================================================
  // WAIT
  // =========================================================

  Blockly.Blocks["skript_wait"] = {
    init() {
      this.appendValueInput("TIME")
        .setCheck("Number")
        .appendField("待機");

      this.appendDummyInput()
        .appendField("秒");

      this.setPreviousStatement(true);
      this.setNextStatement(true);

      this.setColour(270);
    },
  };

  // =========================================================
  // CONTROL
  // =========================================================

  Blockly.Blocks["skript_stop"] = {
    init() {
      this.appendDummyInput()
        .appendField("処理を停止");

      this.setPreviousStatement(true);
      this.setNextStatement(true);

      this.setColour(270);
    },
  };

  Blockly.Blocks["skript_cancel_event"] = {
    init() {
      this.appendDummyInput()
        .appendField("イベントをキャンセル");

      this.setPreviousStatement(true);
      this.setNextStatement(true);

      this.setColour(270);
    },
  };

  Blockly.Blocks["skript_console_command"] = {
    init() {
      this.appendValueInput("COMMAND")
        .setCheck("String")
        .appendField(
          "コンソールからコマンド実行"
        );

      this.setPreviousStatement(true);
      this.setNextStatement(true);

      this.setColour(270);
    },
  };

  Blockly.Blocks["skript_player_command"] = {
    init() {
      this.appendValueInput("COMMAND")
        .setCheck("String")
        .appendField(
          "player からコマンド実行"
        );

      this.setPreviousStatement(true);
      this.setNextStatement(true);

      this.setColour(270);
    },
  };
}

// =============================================================
// GENERATOR HELPERS
// =============================================================

function generateValueBlock(
  block: Blockly.Block
): string {
  switch (block.type) {
    case "skript_text":
      return `"${block.getFieldValue("TEXT")}"`;

    case "skript_number":
      return String(
        block.getFieldValue("NUMBER")
      );

    case "skript_item":
      return String(
        block.getFieldValue("ITEM")
      );

    case "skript_block":
      return String(
        block.getFieldValue("BLOCK")
      );

    case "skript_entity":
      return String(
        block.getFieldValue("ENTITY")
      );

    case "skript_location":
      return String(
        block.getFieldValue("LOCATION")
      );

    default:
      if (
        block.type.startsWith(
          "skript_context_"
        )
      ) {
        return block.type
          .replace(
            "skript_context_",
            ""
          )
          .replace(
            "_",
            "-"
          );
      }

      return "";
  }
}

function getInputCode(
  block: Blockly.Block,
  inputName: string,
  fallback: string
) {
  const child =
    block.getInputTargetBlock(
      inputName
    );

  if (!child) {
    return fallback;
  }

  return generateValueBlock(child);
}

function operatorToSkript(
  operator: string
) {
  switch (operator) {
    case "EQUAL":
      return "=";

    case "NOT_EQUAL":
      return "!=";

    case "GREATER":
      return ">";

    case "LESS":
      return "<";

    case "GREATER_EQUAL":
      return ">=";

    case "LESS_EQUAL":
      return "<=";

    default:
      return "=";
  }
}

// =============================================================
// GENERATOR
// =============================================================

function generateStatements(
  block: Blockly.Block,
  inputName: string,
  indent: string
): string {
  let result = "";

  let child =
    block.getInputTargetBlock(
      inputName
    );

  while (child) {
    const generated =
      generateBlock(
        child,
        indent
      );

    if (generated) {
      result += generated + "\n";
    }

    child =
      child.getNextBlock();
  }

  return result.replace(
    /\n$/,
    ""
  );
}

function generateBlock(
  block: Blockly.Block,
  indent = ""
): string {
  const nextIndent =
    indent + "    ";

  switch (block.type) {
    // =======================================================
    // EVENTS
    // =======================================================

    case "skript_event_join":
      return (
        `${indent}on join:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );

    case "skript_event_quit":
      return (
        `${indent}on quit:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );

    case "skript_event_chat":
      return (
        `${indent}on chat:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );

    case "skript_event_break":
      return (
        `${indent}on break:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );

    case "skript_event_place":
      return (
        `${indent}on place:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );

    case "skript_event_damage":
      return (
        `${indent}on damage:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );

    case "skript_event_death":
      return (
        `${indent}on death:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );

    case "skript_event_respawn":
      return (
        `${indent}on respawn:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );

    case "skript_event_right_click":
      return (
        `${indent}on right click:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );

    case "skript_event_left_click":
      return (
        `${indent}on left click:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );

    case "skript_event_interact":
      return (
        `${indent}on player interact:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );

    case "skript_event_inventory_click":
      return (
        `${indent}on inventory click:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );

    // =======================================================
    // COMMAND
    // =======================================================

    case "skript_command": {
      const command =
        block.getFieldValue(
          "COMMAND"
        ) || "hello";

      return (
        `${indent}command /${command}:\n` +
        `${nextIndent}trigger:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent + "    "
        )
      );
    }

    // =======================================================
    // PLAYER
    // =======================================================

    case "skript_send": {
      const message =
        getInputCode(
          block,
          "MESSAGE",
          `"Hello"`
        );

      return `${indent}send ${message} to player`;
    }

    case "skript_broadcast": {
      const message =
        getInputCode(
          block,
          "MESSAGE",
          `"Hello"`
        );

      return `${indent}broadcast ${message}`;
    }

    case "skript_title": {
      const title =
        getInputCode(
          block,
          "TITLE",
          `"Title"`
        );

      const subtitle =
        getInputCode(
          block,
          "SUBTITLE",
          `""`
        );

      return (
        `${indent}send title ${title} with subtitle ${subtitle} to player`
      );
    }

    case "skript_actionbar": {
      const message =
        getInputCode(
          block,
          "MESSAGE",
          `"Hello"`
        );

      return (
        `${indent}send action bar ${message} to player`
      );
    }

    case "skript_give": {
      const amount =
        getInputCode(
          block,
          "AMOUNT",
          "1"
        );

      const item =
        getInputCode(
          block,
          "ITEM",
          "diamond"
        );

      return (
        `${indent}give ${amount} ${item} to player`
      );
    }

    case "skript_remove": {
      const amount =
        getInputCode(
          block,
          "AMOUNT",
          "1"
        );

      const item =
        getInputCode(
          block,
          "ITEM",
          "diamond"
        );

      return (
        `${indent}remove ${amount} ${item} from player`
      );
    }

    case "skript_heal": {
      const amount =
        getInputCode(
          block,
          "AMOUNT",
          "1"
        );

      return (
        `${indent}heal player by ${amount}`
      );
    }

    case "skript_damage": {
      const amount =
        getInputCode(
          block,
          "AMOUNT",
          "1"
        );

      return (
        `${indent}damage player by ${amount}`
      );
    }

    case "skript_teleport_spawn":
      return (
        `${indent}teleport player to spawn`
      );

    case "skript_teleport_location": {
      const location =
        getInputCode(
          block,
          "LOCATION",
          "world, 0, 64, 0"
        );

      return (
        `${indent}teleport player to ${location}`
      );
    }

    case "skript_kick": {
      const reason =
        getInputCode(
          block,
          "REASON",
          `"Kicked"`
        );

      return (
        `${indent}kick player due to ${reason}`
      );
    }

    case "skript_kill":
      return `${indent}kill player`;

    // =======================================================
    // SOUND
    // =======================================================

    case "skript_sound": {
      const sound =
        block.getFieldValue(
          "SOUND"
        );

      return (
        `${indent}play sound "${sound}" to player`
      );
    }

    // =======================================================
    // GAMEMODE
    // =======================================================

    case "skript_gamemode": {
      const mode =
        block.getFieldValue(
          "MODE"
        );

      return (
        `${indent}set player's gamemode to ${mode}`
      );
    }

    case "skript_fly": {
      const value =
        block.getFieldValue(
          "VALUE"
        );

      return (
        `${indent}set player's flight mode to ${value}`
      );
    }

    // =======================================================
    // IF
    // =======================================================

    case "skript_if": {
      const type =
        block.getFieldValue(
          "TYPE"
        );

      const operator =
        operatorToSkript(
          block.getFieldValue(
            "OP"
          )
        );

      const value =
        getInputCode(
          block,
          "VALUE",
          type === "health"
            ? "10"
            : type === "money"
            ? "100"
            : type === "permission"
            ? `"admin"`
            : type === "item"
            ? "diamond"
            : type === "block"
            ? "diamond_ore"
            : type === "entity"
            ? "zombie"
            : `"value"`
        );

      let condition = "";

      switch (type) {
        case "permission":
          condition =
            `player has permission ${value}`;
          break;

        case "health":
          condition =
            `player's health ${operator} ${value}`;
          break;

        case "item":
          condition =
            `player has ${value}`;
          break;

        case "block":
          condition =
            `event-block ${operator} ${value}`;
          break;

        case "entity":
          condition =
            `event-entity is ${value}`;
          break;

        case "variable":
          condition =
            `{variable} ${operator} ${value}`;
          break;

        case "money":
          condition =
            `player's balance ${operator} ${value}`;
          break;

        case "player":
          condition =
            `player ${operator} ${value}`;
          break;

        case "context":
          condition =
            `event-block ${operator} ${value}`;
          break;

        case "sneaking":
          condition =
            `player is sneaking`;
          break;

        case "sprinting":
          condition =
            `player is sprinting`;
          break;

        case "swimming":
          condition =
            `player is swimming`;
          break;

        case "online":
          condition =
            `player is online`;
          break;

        case "chance":
          condition =
            `chance of ${value}`;
          break;

        default:
          condition =
            `player ${operator} ${value}`;
      }

      return (
        `${indent}if ${condition}:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );
    }

    case "skript_else":
      return (
        `${indent}else:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );

    // =======================================================
    // VARIABLES
    // =======================================================

    case "skript_set_variable": {
      const variable =
        block.getFieldValue(
          "VAR"
        ) || "variable";

      const value =
        getInputCode(
          block,
          "VALUE",
          "0"
        );

      return (
        `${indent}set {${variable}} to ${value}`
      );
    }

    case "skript_add_variable": {
      const variable =
        block.getFieldValue(
          "VAR"
        ) || "coins";

      const value =
        getInputCode(
          block,
          "VALUE",
          "1"
        );

      return (
        `${indent}add ${value} to {${variable}}`
      );
    }

    case "skript_remove_variable": {
      const variable =
        block.getFieldValue(
          "VAR"
        ) || "coins";

      const value =
        getInputCode(
          block,
          "VALUE",
          "1"
        );

      return (
        `${indent}remove ${value} from {${variable}}`
      );
    }

    case "skript_delete_variable": {
      const variable =
        block.getFieldValue(
          "VAR"
        ) || "variable";

      return (
        `${indent}delete {${variable}}`
      );
    }

    // =======================================================
    // LOOPS
    // =======================================================

    case "skript_loop_players":
      return (
        `${indent}loop all players:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );

    case "skript_loop_nearby_players": {
      const distance =
        getInputCode(
          block,
          "DISTANCE",
          "10"
        );

      return (
        `${indent}loop all players in radius ${distance} around player:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );
    }

    case "skript_loop_entities":
      return (
        `${indent}loop all entities in radius 10 around player:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );

    case "skript_loop_number": {
      const count =
        getInputCode(
          block,
          "COUNT",
          "5"
        );

      return (
        `${indent}loop ${count} times:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );
    }

    case "skript_loop_while": {
      const condition =
        getInputCode(
          block,
          "CONDITION",
          "true"
        );

      return (
        `${indent}while ${condition}:\n` +
        generateStatements(
          block,
          "DO",
          nextIndent
        )
      );
    }

    // =======================================================
    // OTHER
    // =======================================================

    case "skript_wait": {
      const time =
        getInputCode(
          block,
          "TIME",
          "1"
        );

      return (
        `${indent}wait ${time} seconds`
      );
    }

    case "skript_stop":
      return `${indent}stop`;

    case "skript_cancel_event":
      return `${indent}cancel event`;

    case "skript_console_command": {
      const command =
        getInputCode(
          block,
          "COMMAND",
          `"say Hello"`
        );

      return (
        `${indent}execute console command ${command}`
      );
    }

    case "skript_player_command": {
      const command =
        getInputCode(
          block,
          "COMMAND",
          `"spawn"`
        );

      return (
        `${indent}make player execute command ${command}`
      );
    }

    default:
      return "";
  }
}

function generateWorkspaceCode(
  workspace: Blockly.Workspace
) {
  const blocks =
    workspace.getTopBlocks(true);

  let result = "";

  for (const block of blocks) {
    const generated =
      generateBlock(block);

    if (generated) {
      result +=
        generated +
        "\n\n";
    }
  }

  return result.trim();
}

// =============================================================
// TOOLBOX
// =============================================================

const toolbox = {
  kind: "categoryToolbox",

  contents: [
    // =========================================================
    // EVENTS
    // =========================================================

    {
      kind: "category",
      name: "🟢 イベント",
      colour: "120",

      contents: [
        {
          kind: "block",
          type: "skript_event_join",
        },
        {
          kind: "block",
          type: "skript_event_quit",
        },
        {
          kind: "block",
          type: "skript_event_chat",
        },
        {
          kind: "block",
          type: "skript_event_break",
        },
        {
          kind: "block",
          type: "skript_event_place",
        },
        {
          kind: "block",
          type: "skript_event_damage",
        },
        {
          kind: "block",
          type: "skript_event_death",
        },
        {
          kind: "block",
          type: "skript_event_respawn",
        },
        {
          kind: "block",
          type: "skript_event_right_click",
        },
        {
          kind: "block",
          type: "skript_event_left_click",
        },
        {
          kind: "block",
          type: "skript_event_interact",
        },
        {
          kind: "block",
          type: "skript_event_inventory_click",
        },
        {
          kind: "block",
          type: "skript_command",
        },
      ],
    },

    // =========================================================
    // PLAYER
    // =========================================================

    {
      kind: "category",
      name: "🔵 プレイヤー",
      colour: "210",

      contents: [
        {
          kind: "block",
          type: "skript_send",
        },
        {
          kind: "block",
          type: "skript_broadcast",
        },
        {
          kind: "block",
          type: "skript_title",
        },
        {
          kind: "block",
          type: "skript_actionbar",
        },
        {
          kind: "block",
          type: "skript_give",
        },
        {
          kind: "block",
          type: "skript_remove",
        },
        {
          kind: "block",
          type: "skript_heal",
        },
        {
          kind: "block",
          type: "skript_damage",
        },
        {
          kind: "block",
          type: "skript_teleport_spawn",
        },
        {
          kind: "block",
          type: "skript_teleport_location",
        },
        {
          kind: "block",
          type: "skript_kick",
        },
        {
          kind: "block",
          type: "skript_kill",
        },
        {
          kind: "block",
          type: "skript_sound",
        },
        {
          kind: "block",
          type: "skript_gamemode",
        },
        {
          kind: "block",
          type: "skript_fly",
        },
      ],
    },

    // =========================================================
    // CONDITIONS
    // =========================================================

    {
      kind: "category",
      name: "🟠 条件",
      colour: "45",

      contents: [
        {
          kind: "block",
          type: "skript_if",
        },
        {
          kind: "block",
          type: "skript_else",
        },
      ],
    },

    // =========================================================
    // SKRIPT VALUES
    // =========================================================

    {
      kind: "category",
      name: "🟣 Skript値",
      colour: "160",

      contents: [
        {
          kind: "block",
          type: "skript_context_player",
        },
        {
          kind: "block",
          type: "skript_context_event_player",
        },
        {
          kind: "block",
          type: "skript_context_loop_player",
        },
        {
          kind: "block",
          type: "skript_context_victim",
        },
        {
          kind: "block",
          type: "skript_context_attacker",
        },
        {
          kind: "block",
          type: "skript_context_event_block",
        },
        {
          kind: "block",
          type: "skript_context_event_item",
        },
        {
          kind: "block",
          type: "skript_context_event_entity",
        },
        {
          kind: "block",
          type: "skript_context_event_damage",
        },
        {
          kind: "block",
          type: "skript_context_event_message",
        },
        {
          kind: "block",
          type: "skript_context_world",
        },
        {
          kind: "block",
          type: "skript_context_location",
        },
        {
          kind: "block",
          type: "skript_text",
        },
        {
          kind: "block",
          type: "skript_number",
        },
        {
          kind: "block",
          type: "skript_item",
        },
        {
          kind: "block",
          type: "skript_block",
        },
        {
          kind: "block",
          type: "skript_entity",
        },
        {
          kind: "block",
          type: "skript_location",
        },
      ],
    },

    // =========================================================
    // VARIABLES
    // =========================================================

    {
      kind: "category",
      name: "🟡 変数",
      colour: "55",

      contents: [
        {
          kind: "block",
          type: "skript_set_variable",
        },
        {
          kind: "block",
          type: "skript_add_variable",
        },
        {
          kind: "block",
          type: "skript_remove_variable",
        },
        {
          kind: "block",
          type: "skript_delete_variable",
        },
      ],
    },

    // =========================================================
    // LOOPS
    // =========================================================

    {
      kind: "category",
      name: "🔄 ループ",
      colour: "290",

      contents: [
        {
          kind: "block",
          type: "skript_loop_players",
        },
        {
          kind: "block",
          type: "skript_loop_nearby_players",
        },
        {
          kind: "block",
          type: "skript_loop_entities",
        },
        {
          kind: "block",
          type: "skript_loop_number",
        },
        {
          kind: "block",
          type: "skript_loop_while",
        },
      ],
    },

    // =========================================================
    // OTHER
    // =========================================================

    {
      kind: "category",
      name: "⚙️ その他",
      colour: "270",

      contents: [
        {
          kind: "block",
          type: "skript_wait",
        },
        {
          kind: "block",
          type: "skript_stop",
        },
        {
          kind: "block",
          type: "skript_cancel_event",
        },
        {
          kind: "block",
          type: "skript_console_command",
        },
        {
          kind: "block",
          type: "skript_player_command",
        },
      ],
    },
  ],
};

// =============================================================
// APP
// =============================================================

function App() {
  const blocklyDiv =
    useRef<HTMLDivElement>(null);

  const workspaceRef =
    useRef<Blockly.WorkspaceSvg | null>(
      null
    );

  const [code, setCode] =
    useState("");

  const [notification, setNotification] =
    useState<{
      type: NotificationType;
      text: string;
    } | null>(null);

  // ===========================================================
  // BLOCKLY
  // ===========================================================

  useEffect(() => {
    registerBlocks();

    if (!blocklyDiv.current) {
      return;
    }

    const workspace =
      Blockly.inject(
        blocklyDiv.current,
        {
          toolbox,

          trashcan: true,

          renderer: "zelos",

          grid: {
            spacing: 20,
            length: 3,
            colour: "#444",
            snap: true,
          },

          zoom: {
            controls: true,
            wheel: true,
            startScale: 0.9,
            maxScale: 1.5,
            minScale: 0.5,
            scaleSpeed: 1.1,
          },

          move: {
            scrollbars: true,
            drag: true,
            wheel: true,
          },
        }
      );

    workspaceRef.current =
      workspace;

    const update =
      () => {
        setCode(
          generateWorkspaceCode(
            workspace
          )
        );
      };

    workspace.addChangeListener(
      update
    );

    update();

    return () => {
      workspace.dispose();
      workspaceRef.current =
        null;
    };
  }, []);

  // ===========================================================
  // NOTIFICATION
  // ===========================================================

  const notify = (
    text: string,
    type: NotificationType = "success"
  ) => {
    setNotification({
      text,
      type,
    });

    window.setTimeout(
      () => {
        setNotification(null);
      },
      2500
    );
  };

  // ===========================================================
  // SAVE
  // ===========================================================

  const saveProject =
    () => {
      const workspace =
        workspaceRef.current;

      if (!workspace) {
        return;
      }

      const state =
        Blockly.serialization.workspaces.save(
          workspace
        );

      const blob =
        new Blob(
          [
            JSON.stringify(
              state,
              null,
              2
            ),
          ],
          {
            type: "application/json",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;
      a.download =
        PROJECT_FILE;

      a.click();

      URL.revokeObjectURL(
        url
      );

      notify(
        "プロジェクトを保存しました"
      );
    };

  // ===========================================================
  // LOAD
  // ===========================================================

  const loadProject =
    () => {
      const input =
        document.createElement(
          "input"
        );

      input.type = "file";
      input.accept =
        ".json";

      input.onchange =
        async () => {
          const file =
            input.files?.[0];

          if (!file) {
            return;
          }

          try {
            const text =
              await file.text();

            const state =
              JSON.parse(
                text
              );

            const workspace =
              workspaceRef.current;

            if (!workspace) {
              return;
            }

            workspace.clear();

            Blockly.serialization.workspaces.load(
              state,
              workspace
            );

            setCode(
              generateWorkspaceCode(
                workspace
              )
            );

            notify(
              "プロジェクトを読み込みました"
            );
          } catch {
            notify(
              "読み込みに失敗しました",
              "error"
            );
          }
        };

      input.click();
    };

  // ===========================================================
  // COPY
  // ===========================================================

  const copyCode =
    async () => {
      if (!code) {
        notify(
          "コピーするコードがありません",
          "info"
        );

        return;
      }

      try {
        await navigator.clipboard.writeText(
          code
        );

        notify(
          "Skriptコードをコピーしました"
        );
      } catch {
        notify(
          "コピーに失敗しました",
          "error"
        );
      }
    };

  // ===========================================================
  // EXPORT
  // ===========================================================

  const exportSkript =
    () => {
      if (!code) {
        notify(
          "出力するコードがありません",
          "info"
        );

        return;
      }

      const blob =
        new Blob(
          [code],
          {
            type:
              "text/plain;charset=utf-8",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;
      a.download =
        "main.sk";

      a.click();

      URL.revokeObjectURL(
        url
      );

      notify(
        "main.sk を出力しました"
      );
    };

  // ===========================================================
  // CLEAR
  // ===========================================================

  const clearWorkspace =
    () => {
      const workspace =
        workspaceRef.current;

      if (!workspace) {
        return;
      }

      if (
        !window.confirm(
          "ブロックをすべて削除しますか？"
        )
      ) {
        return;
      }

      workspace.clear();

      setCode("");

      notify(
        "ワークスペースをクリアしました"
      );
    };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          🧩 SkySkript Builder
          <span>v0.4</span>
        </div>

        <div className="toolbar">
          <button
            onClick={loadProject}
          >
            📂 開く
          </button>

          <button
            onClick={saveProject}
          >
            💾 保存
          </button>

          <button
            onClick={copyCode}
          >
            📋 コピー
          </button>

          <button
            onClick={exportSkript}
          >
            📄 .sk出力
          </button>

          <button
            className="danger"
            onClick={
              clearWorkspace
            }
          >
            🗑 クリア
          </button>
        </div>
      </header>

      <main className="main">
        <section className="editor">
          <div className="panel-title">
            <span>
              🧩 ブロックエディタ
            </span>

            <span className="hint">
              ブロックをつないでSkriptを作成
            </span>
          </div>

          <div
            ref={blocklyDiv}
            className="blockly-container"
          />
        </section>

        <section className="preview">
          <div className="panel-title">
            <span>
              📜 Skript Preview
            </span>

            <span className="language">
              Skript
            </span>
          </div>

          <pre className="code">
            {code || (
              <span className="empty">
                ブロックを配置すると
                {"\n"}
                ここにSkriptコードが表示されます
              </span>
            )}
          </pre>
        </section>
      </main>

      <footer className="footer">
        <span>
          SkySkript Builder
        </span>

        <span>
          Blockly × Skript
        </span>
      </footer>

      {notification && (
        <div
          className={`notification ${notification.type}`}
        >
          {notification.text}
        </div>
      )}
    </div>
  );
}

export default App;