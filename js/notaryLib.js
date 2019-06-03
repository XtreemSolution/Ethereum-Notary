var contract = undefined;
var customProvider = undefined;
var fundationAddress = "0x67bFE8893d892B8B2ddE809A7FDA6caE934d0a9b";
var rinkebyAddress =  "0xd121f94184Da71908123a1e08F72cAB8573b9363";
var ropstenAddress =  "0xA5cEF3eEFCd97B62ebfDF385f4bfBeb08f131C9D";
var kovanAddress = "0x62dbf3f3ff221e383d7c696e706356cdb86fae56";
var address = undefined;
var abi = undefined;
var useBackEnd = true;

function notary_init () {

  // if (customProvider) { //ethereum node specified by user
  //   window.web3 = new Web3(new Web3.providers.HttpProvider(customProvider));
  //   console.log("Provider set to: " + customProvider);
  // }
  // else {
    // Check if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {

      $("#noWeb3").hide();

      // Use existing gateway
      window.web3 = new Web3(web3.currentProvider);

      useBackEnd = false;

      $.getJSON("contract/Notary.json", function(json) {
        abi = json.abi;
        var contractDef = web3.eth.contract(abi);
        var netId = web3.version.network;

        switch (netId) {
          case "1":
          address = fundationAddress;
          break;
          case "3":
          address = ropstenAddress;
          break;
          case "4":
          address = rinkebyAddress;
          break;
          case "42":
          address = kovanAddress;
          break;
          default:
          //alert("Current Network not supported");
        }

        contract = contractDef.at(address);
      } );

    } else {
      $("#noWeb3").show();
      //fallback to back-end API
      useBackEnd = true;
      address = rinkebyAddress;
    }
//  }
};  



function notary_send(hash, callback) {
  // console.log(web3.eth.accounts[0]);
  // return false;
  var accounts = "0x66527C1CA4d42b5134Eb68DCCd84cD731C683a09";
  
  if (!useBackEnd) {
    contract.addDocHash.sendTransaction(hash, {
      from: accounts,
    }, function(error, tx){
      if (error) callback(error, null);
      else callback(null, tx);
    });
  }
  else {
    $.post("/doc/"+hash,  function(result) {
      callback(null, result);
    });
  }

  

};

function notary_find(hash, callback) {
  if (!useBackEnd) {
    contract.findDocHash.call(hash, function (error, result) {
      if (error) callback(error, null);
      else {
        var resultObj = {
          mineTime : result[0],
          blockNumber : result[1]
        };
        callback(null, resultObj);
      }
    });
  }
  else {
    $.get("/doc/"+hash,  function(result) {
      callback(null, result);
    });

  }
};
