# this whole thing was more or less copy pasted from https://github.com/cargo2nix/cargo2nix/tree/master/examples/1-hello-world
{
  inputs = {
    nixpkgs.follows = "cargo2nix/nixpkgs";
    cargo2nix.url = "github:cargo2nix/cargo2nix/release-0.11.0";
    flake-utils.follows = "cargo2nix/flake-utils";

    # this rust overlay is supposedly better than mozillas
    # should auto merge mozilla upstream,
    # so if its not up to date somethings up
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      
      inputs = {
        nixpkgs.follows = "nixpkgs";
        flake-utils.follows = "flake-utils";
      };
    };
  };
  outputs = { self, nixpkgs, cargo2nix, flake-utils, rust-overlay, ...}:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          #crossSystem = {
          #  config = "wasm32-unknown";
          #};
          overlays = [
            cargo2nix.overlays.default
            #(import "${cargo2nix}/overlay")
            (rust-overlay.overlay)
          ];
        };
        rustPkgs = pkgs.rustBuilder.makePackageSet {
          #rustChannel = "1.58.1"; # no clue if this version will work for emulator-rs";
          rustToolchain = pkgs.rust-bin.selectLatestNightlyWith (toolchain: toolchain.default.override {
            targets = ["wasm32-unknown-unknown"];
          });
          packageFun = import ./Cargo.nix;
          packageOverrides = p: p.rustBuilder.overrides.all ++ [
            (p.rustBuilder.rustLib.makeOverride {
              name = "emulator-rs";
              overrideAttrs = drv: {
                propagatedNativeBuildInputs =
                  (drv.propagatedNativeBuildInputs or []) ++ [p.git p.wasm-pack] ++
                  p.lib.optionals (p.stdenv.hostPlatform.isDarwin) [p.darwin.apple_sdk.frameworks.AppKit];
                  
                    #TODO: im pretty sure theres like lib.optional or smth for this pattern
                    # not sure whats making it require to link against appkit ?
                    # but linking fails without appkit so idk
                    # TODO: identify whats requriing to link against appkit so we can override /that/
                    # to make it always pull in appkit, and then put that override in cargo2nix so nobody
                    # has to do this again
              };
            })
          ];
        };
      in rec {
        packages = {
          emulator-rs = (rustPkgs.workspace.emulator-rs{}).bin;
        };
        # cargo2nix provides its own mkshell thing i believe, as workspace-shell
        #devShell = pkgs.mkShell {
        #  buildInputs = with pkgs; [];
        #  inputsFrom = builtins.attrValues self.packages.${system};
        #};
        defaultPackage = packages.emulator-rs;
      }
    );
}
