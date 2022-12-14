# This file was @generated by cargo2nix 0.11.0.
# It is not intended to be manually edited.

args@{
  release ? true,
  rootFeatures ? [
    "emulator-rs/default"
  ],
  rustPackages,
  buildRustPackages,
  hostPlatform,
  hostPlatformCpu ? null,
  hostPlatformFeatures ? [],
  target ? null,
  codegenOpts ? null,
  profileOpts ? null,
  rustcLinkFlags ? null,
  rustcBuildFlags ? null,
  mkRustCrate,
  rustLib,
  lib,
  workspaceSrc,
}:
let
  workspaceSrc = if args.workspaceSrc == null then ./. else args.workspaceSrc;
in let
  inherit (rustLib) fetchCratesIo fetchCrateLocal fetchCrateGit fetchCrateAlternativeRegistry expandFeatures decideProfile genDrvsByProfile;
  profilesByName = {
    release = builtins.fromTOML "opt-level = \"s\"\n";
  };
  rootFeatures' = expandFeatures rootFeatures;
  overridableMkRustCrate = f:
    let
      drvs = genDrvsByProfile profilesByName ({ profile, profileName }: mkRustCrate ({ inherit release profile hostPlatformCpu hostPlatformFeatures target profileOpts codegenOpts rustcLinkFlags rustcBuildFlags; } // (f profileName)));
    in { compileMode ? null, profileName ? decideProfile compileMode release }:
      let drv = drvs.${profileName}; in if compileMode == null then drv else drv.override { inherit compileMode; };
in
{
  cargo2nixVersion = "0.11.0";
  workspace = {
    emulator-rs = rustPackages.unknown.emulator-rs."0.1.0";
  };
  "registry+https://github.com/rust-lang/crates.io-index".bumpalo."3.11.0" = overridableMkRustCrate (profileName: rec {
    name = "bumpalo";
    version = "3.11.0";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "c1ad822118d20d2c234f427000d5acc36eabe1e29a348c89b63dd60b13f28e5d"; };
    features = builtins.concatLists [
      [ "default" ]
    ];
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".cfg-if."0.1.10" = overridableMkRustCrate (profileName: rec {
    name = "cfg-if";
    version = "0.1.10";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "4785bdd1c96b2a846b2bd7cc02e86b6b3dbf14e7e53446c4f54c92a361040822"; };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".cfg-if."1.0.0" = overridableMkRustCrate (profileName: rec {
    name = "cfg-if";
    version = "1.0.0";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "baf1de4339761588bc0619e3cbc0120ee582ebb74b53b4efbf79117bd2da40fd"; };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".console_error_panic_hook."0.1.7" = overridableMkRustCrate (profileName: rec {
    name = "console_error_panic_hook";
    version = "0.1.7";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "a06aeb73f470f66dcdbf7223caeebb85984942f22f1adb2a088cf9668146bbbc"; };
    dependencies = {
      cfg_if = rustPackages."registry+https://github.com/rust-lang/crates.io-index".cfg-if."1.0.0" { inherit profileName; };
      wasm_bindgen = rustPackages."registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen."0.2.83" { inherit profileName; };
    };
  });
  
  "unknown".emulator-rs."0.1.0" = overridableMkRustCrate (profileName: rec {
    name = "emulator-rs";
    version = "0.1.0";
    registry = "unknown";
    src = fetchCrateLocal workspaceSrc;
    features = builtins.concatLists [
      (lib.optional (rootFeatures' ? "emulator-rs/console_error_panic_hook" || rootFeatures' ? "emulator-rs/default") "console_error_panic_hook")
      (lib.optional (rootFeatures' ? "emulator-rs/default") "default")
      (lib.optional (rootFeatures' ? "emulator-rs/wee_alloc") "wee_alloc")
    ];
    dependencies = {
      ${ if rootFeatures' ? "emulator-rs/console_error_panic_hook" || rootFeatures' ? "emulator-rs/default" then "console_error_panic_hook" else null } = rustPackages."registry+https://github.com/rust-lang/crates.io-index".console_error_panic_hook."0.1.7" { inherit profileName; };
      wasm_bindgen = rustPackages."registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen."0.2.83" { inherit profileName; };
      ${ if rootFeatures' ? "emulator-rs/wee_alloc" then "wee_alloc" else null } = rustPackages."registry+https://github.com/rust-lang/crates.io-index".wee_alloc."0.4.5" { inherit profileName; };
    };
    devDependencies = {
      wasm_bindgen_test = rustPackages."registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen-test."0.3.33" { inherit profileName; };
    };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".js-sys."0.3.60" = overridableMkRustCrate (profileName: rec {
    name = "js-sys";
    version = "0.3.60";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "49409df3e3bf0856b916e2ceaca09ee28e6871cf7d9ce97a692cacfdb2a25a47"; };
    dependencies = {
      wasm_bindgen = rustPackages."registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen."0.2.83" { inherit profileName; };
    };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".libc."0.2.134" = overridableMkRustCrate (profileName: rec {
    name = "libc";
    version = "0.2.134";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "329c933548736bc49fd575ee68c89e8be4d260064184389a5b77517cddd99ffb"; };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".log."0.4.17" = overridableMkRustCrate (profileName: rec {
    name = "log";
    version = "0.4.17";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "abb12e687cfb44aa40f41fc3978ef76448f9b6038cad6aef4259d3c095a2382e"; };
    dependencies = {
      cfg_if = rustPackages."registry+https://github.com/rust-lang/crates.io-index".cfg-if."1.0.0" { inherit profileName; };
    };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".memory_units."0.4.0" = overridableMkRustCrate (profileName: rec {
    name = "memory_units";
    version = "0.4.0";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "8452105ba047068f40ff7093dd1d9da90898e63dd61736462e9cdda6a90ad3c3"; };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".once_cell."1.15.0" = overridableMkRustCrate (profileName: rec {
    name = "once_cell";
    version = "1.15.0";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "e82dad04139b71a90c080c8463fe0dc7902db5192d939bd0950f074d014339e1"; };
    features = builtins.concatLists [
      [ "alloc" ]
      [ "default" ]
      [ "race" ]
      [ "std" ]
    ];
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".proc-macro2."1.0.46" = overridableMkRustCrate (profileName: rec {
    name = "proc-macro2";
    version = "1.0.46";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "94e2ef8dbfc347b10c094890f778ee2e36ca9bb4262e86dc99cd217e35f3470b"; };
    features = builtins.concatLists [
      [ "default" ]
      [ "proc-macro" ]
    ];
    dependencies = {
      unicode_ident = rustPackages."registry+https://github.com/rust-lang/crates.io-index".unicode-ident."1.0.4" { inherit profileName; };
    };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".quote."1.0.21" = overridableMkRustCrate (profileName: rec {
    name = "quote";
    version = "1.0.21";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "bbe448f377a7d6961e30f5955f9b8d106c3f5e449d493ee1b125c1d43c2b5179"; };
    features = builtins.concatLists [
      [ "default" ]
      [ "proc-macro" ]
    ];
    dependencies = {
      proc_macro2 = rustPackages."registry+https://github.com/rust-lang/crates.io-index".proc-macro2."1.0.46" { inherit profileName; };
    };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".scoped-tls."1.0.0" = overridableMkRustCrate (profileName: rec {
    name = "scoped-tls";
    version = "1.0.0";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "ea6a9290e3c9cf0f18145ef7ffa62d68ee0bf5fcd651017e586dc7fd5da448c2"; };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".syn."1.0.101" = overridableMkRustCrate (profileName: rec {
    name = "syn";
    version = "1.0.101";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "e90cde112c4b9690b8cbe810cba9ddd8bc1d7472e2cae317b69e9438c1cba7d2"; };
    features = builtins.concatLists [
      [ "clone-impls" ]
      [ "default" ]
      [ "derive" ]
      [ "full" ]
      [ "parsing" ]
      [ "printing" ]
      [ "proc-macro" ]
      [ "quote" ]
      [ "visit" ]
    ];
    dependencies = {
      proc_macro2 = rustPackages."registry+https://github.com/rust-lang/crates.io-index".proc-macro2."1.0.46" { inherit profileName; };
      quote = rustPackages."registry+https://github.com/rust-lang/crates.io-index".quote."1.0.21" { inherit profileName; };
      unicode_ident = rustPackages."registry+https://github.com/rust-lang/crates.io-index".unicode-ident."1.0.4" { inherit profileName; };
    };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".unicode-ident."1.0.4" = overridableMkRustCrate (profileName: rec {
    name = "unicode-ident";
    version = "1.0.4";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "dcc811dc4066ac62f84f11307873c4850cb653bfa9b1719cee2bd2204a4bc5dd"; };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen."0.2.83" = overridableMkRustCrate (profileName: rec {
    name = "wasm-bindgen";
    version = "0.2.83";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "eaf9f5aceeec8be17c128b2e93e031fb8a4d469bb9c4ae2d7dc1888b26887268"; };
    features = builtins.concatLists [
      [ "default" ]
      [ "spans" ]
      [ "std" ]
    ];
    dependencies = {
      cfg_if = rustPackages."registry+https://github.com/rust-lang/crates.io-index".cfg-if."1.0.0" { inherit profileName; };
      wasm_bindgen_macro = buildRustPackages."registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen-macro."0.2.83" { profileName = "__noProfile"; };
    };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen-backend."0.2.83" = overridableMkRustCrate (profileName: rec {
    name = "wasm-bindgen-backend";
    version = "0.2.83";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "4c8ffb332579b0557b52d268b91feab8df3615f265d5270fec2a8c95b17c1142"; };
    features = builtins.concatLists [
      [ "spans" ]
    ];
    dependencies = {
      bumpalo = rustPackages."registry+https://github.com/rust-lang/crates.io-index".bumpalo."3.11.0" { inherit profileName; };
      log = rustPackages."registry+https://github.com/rust-lang/crates.io-index".log."0.4.17" { inherit profileName; };
      once_cell = rustPackages."registry+https://github.com/rust-lang/crates.io-index".once_cell."1.15.0" { inherit profileName; };
      proc_macro2 = rustPackages."registry+https://github.com/rust-lang/crates.io-index".proc-macro2."1.0.46" { inherit profileName; };
      quote = rustPackages."registry+https://github.com/rust-lang/crates.io-index".quote."1.0.21" { inherit profileName; };
      syn = rustPackages."registry+https://github.com/rust-lang/crates.io-index".syn."1.0.101" { inherit profileName; };
      wasm_bindgen_shared = rustPackages."registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen-shared."0.2.83" { inherit profileName; };
    };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen-futures."0.4.33" = overridableMkRustCrate (profileName: rec {
    name = "wasm-bindgen-futures";
    version = "0.4.33";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "23639446165ca5a5de86ae1d8896b737ae80319560fbaa4c2887b7da6e7ebd7d"; };
    dependencies = {
      cfg_if = rustPackages."registry+https://github.com/rust-lang/crates.io-index".cfg-if."1.0.0" { inherit profileName; };
      js_sys = rustPackages."registry+https://github.com/rust-lang/crates.io-index".js-sys."0.3.60" { inherit profileName; };
      wasm_bindgen = rustPackages."registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen."0.2.83" { inherit profileName; };
      ${ if builtins.elem "atomics" hostPlatformFeatures then "web_sys" else null } = rustPackages."registry+https://github.com/rust-lang/crates.io-index".web-sys."0.3.60" { inherit profileName; };
    };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen-macro."0.2.83" = overridableMkRustCrate (profileName: rec {
    name = "wasm-bindgen-macro";
    version = "0.2.83";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "052be0f94026e6cbc75cdefc9bae13fd6052cdcaf532fa6c45e7ae33a1e6c810"; };
    features = builtins.concatLists [
      [ "spans" ]
    ];
    dependencies = {
      quote = rustPackages."registry+https://github.com/rust-lang/crates.io-index".quote."1.0.21" { inherit profileName; };
      wasm_bindgen_macro_support = rustPackages."registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen-macro-support."0.2.83" { inherit profileName; };
    };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen-macro-support."0.2.83" = overridableMkRustCrate (profileName: rec {
    name = "wasm-bindgen-macro-support";
    version = "0.2.83";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "07bc0c051dc5f23e307b13285f9d75df86bfdf816c5721e573dec1f9b8aa193c"; };
    features = builtins.concatLists [
      [ "spans" ]
    ];
    dependencies = {
      proc_macro2 = rustPackages."registry+https://github.com/rust-lang/crates.io-index".proc-macro2."1.0.46" { inherit profileName; };
      quote = rustPackages."registry+https://github.com/rust-lang/crates.io-index".quote."1.0.21" { inherit profileName; };
      syn = rustPackages."registry+https://github.com/rust-lang/crates.io-index".syn."1.0.101" { inherit profileName; };
      wasm_bindgen_backend = rustPackages."registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen-backend."0.2.83" { inherit profileName; };
      wasm_bindgen_shared = rustPackages."registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen-shared."0.2.83" { inherit profileName; };
    };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen-shared."0.2.83" = overridableMkRustCrate (profileName: rec {
    name = "wasm-bindgen-shared";
    version = "0.2.83";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "1c38c045535d93ec4f0b4defec448e4291638ee608530863b1e2ba115d4fff7f"; };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen-test."0.3.33" = overridableMkRustCrate (profileName: rec {
    name = "wasm-bindgen-test";
    version = "0.3.33";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "09d2fff962180c3fadf677438054b1db62bee4aa32af26a45388af07d1287e1d"; };
    dependencies = {
      console_error_panic_hook = rustPackages."registry+https://github.com/rust-lang/crates.io-index".console_error_panic_hook."0.1.7" { inherit profileName; };
      js_sys = rustPackages."registry+https://github.com/rust-lang/crates.io-index".js-sys."0.3.60" { inherit profileName; };
      scoped_tls = rustPackages."registry+https://github.com/rust-lang/crates.io-index".scoped-tls."1.0.0" { inherit profileName; };
      wasm_bindgen = rustPackages."registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen."0.2.83" { inherit profileName; };
      wasm_bindgen_futures = rustPackages."registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen-futures."0.4.33" { inherit profileName; };
      wasm_bindgen_test_macro = buildRustPackages."registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen-test-macro."0.3.33" { profileName = "__noProfile"; };
    };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen-test-macro."0.3.33" = overridableMkRustCrate (profileName: rec {
    name = "wasm-bindgen-test-macro";
    version = "0.3.33";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "4683da3dfc016f704c9f82cf401520c4f1cb3ee440f7f52b3d6ac29506a49ca7"; };
    dependencies = {
      proc_macro2 = rustPackages."registry+https://github.com/rust-lang/crates.io-index".proc-macro2."1.0.46" { inherit profileName; };
      quote = rustPackages."registry+https://github.com/rust-lang/crates.io-index".quote."1.0.21" { inherit profileName; };
    };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".web-sys."0.3.60" = overridableMkRustCrate (profileName: rec {
    name = "web-sys";
    version = "0.3.60";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "bcda906d8be16e728fd5adc5b729afad4e444e106ab28cd1c7256e54fa61510f"; };
    features = builtins.concatLists [
      [ "Event" ]
      [ "EventTarget" ]
      [ "MessageEvent" ]
      [ "Worker" ]
    ];
    dependencies = {
      js_sys = rustPackages."registry+https://github.com/rust-lang/crates.io-index".js-sys."0.3.60" { inherit profileName; };
      wasm_bindgen = rustPackages."registry+https://github.com/rust-lang/crates.io-index".wasm-bindgen."0.2.83" { inherit profileName; };
    };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".wee_alloc."0.4.5" = overridableMkRustCrate (profileName: rec {
    name = "wee_alloc";
    version = "0.4.5";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "dbb3b5a6b2bb17cb6ad44a2e68a43e8d2722c997da10e928665c72ec6c0a0b8e"; };
    features = builtins.concatLists [
      (lib.optional (rootFeatures' ? "emulator-rs/wee_alloc") "default")
      (lib.optional (rootFeatures' ? "emulator-rs/wee_alloc") "size_classes")
    ];
    dependencies = {
      ${ if rootFeatures' ? "emulator-rs/wee_alloc" then "cfg_if" else null } = rustPackages."registry+https://github.com/rust-lang/crates.io-index".cfg-if."0.1.10" { inherit profileName; };
      ${ if rootFeatures' ? "emulator-rs/wee_alloc" && hostPlatform.isUnix && !(hostPlatform.parsed.cpu.name == "wasm32") then "libc" else null } = rustPackages."registry+https://github.com/rust-lang/crates.io-index".libc."0.2.134" { inherit profileName; };
      ${ if rootFeatures' ? "emulator-rs/wee_alloc" then "memory_units" else null } = rustPackages."registry+https://github.com/rust-lang/crates.io-index".memory_units."0.4.0" { inherit profileName; };
      ${ if rootFeatures' ? "emulator-rs/wee_alloc" && hostPlatform.parsed.kernel.name == "windows" then "winapi" else null } = rustPackages."registry+https://github.com/rust-lang/crates.io-index".winapi."0.3.9" { inherit profileName; };
    };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".winapi."0.3.9" = overridableMkRustCrate (profileName: rec {
    name = "winapi";
    version = "0.3.9";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "5c839a674fcd7a98952e593242ea400abe93992746761e38641405d28b00f419"; };
    features = builtins.concatLists [
      (lib.optional (rootFeatures' ? "emulator-rs/wee_alloc") "memoryapi")
      (lib.optional (rootFeatures' ? "emulator-rs/wee_alloc") "synchapi")
      (lib.optional (rootFeatures' ? "emulator-rs/wee_alloc") "winbase")
    ];
    dependencies = {
      ${ if rootFeatures' ? "emulator-rs/wee_alloc" && hostPlatform.config == "i686-pc-windows-gnu" then "winapi_i686_pc_windows_gnu" else null } = rustPackages."registry+https://github.com/rust-lang/crates.io-index".winapi-i686-pc-windows-gnu."0.4.0" { inherit profileName; };
      ${ if rootFeatures' ? "emulator-rs/wee_alloc" && hostPlatform.config == "x86_64-pc-windows-gnu" then "winapi_x86_64_pc_windows_gnu" else null } = rustPackages."registry+https://github.com/rust-lang/crates.io-index".winapi-x86_64-pc-windows-gnu."0.4.0" { inherit profileName; };
    };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".winapi-i686-pc-windows-gnu."0.4.0" = overridableMkRustCrate (profileName: rec {
    name = "winapi-i686-pc-windows-gnu";
    version = "0.4.0";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "ac3b87c63620426dd9b991e5ce0329eff545bccbbb34f3be09ff6fb6ab51b7b6"; };
  });
  
  "registry+https://github.com/rust-lang/crates.io-index".winapi-x86_64-pc-windows-gnu."0.4.0" = overridableMkRustCrate (profileName: rec {
    name = "winapi-x86_64-pc-windows-gnu";
    version = "0.4.0";
    registry = "registry+https://github.com/rust-lang/crates.io-index";
    src = fetchCratesIo { inherit name version; sha256 = "712e227841d057c1ee1cd2fb22fa7e5a5461ae8e48fa2ca79ec42cfc1931183f"; };
  });
  
}
