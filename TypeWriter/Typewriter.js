/**
 * Created by oliver on 1/13/16.
 */
function Typewriter(sSelector, nRate) {
    function clean() {
        clearInterval(nIntervId);
        bTyping = false;
        bStart = true;
        oCurrent = null;
        aSheets.length = nIdx = 0;
    }

    function scroll(oSheet, nPos, bEraseAndStop) {
        if (!oSheet.hasOwnProperty("parts") || aMap.length < nPos) {
            return true;
        }

        var oRel, bExit = false;

        if (aMap.length === nPos) {
            aMap.push(0);
        }

        while (aMap[nPos] < oSheet.parts.length) {
            oRel = oSheet.parts[aMap[nPos]];

            scroll(oRel, nPos + 1, bEraseAndStop) ? aMap[nPos]++ : bExit = true;

            if (bEraseAndStop && (oRel.ref.nodeType - 1 | 1) === 3 && oRel.ref.nodeValue) {
                bExit = true;
                oCurrent = oRel.ref;
                sPart = oCurrent.nodeValue;
                oCurrent.nodeValue = "";
            }

            oSheet.ref.appendChild(oRel.ref);
            if (bExit) {
                return false;
            }
        }

        aMap.length--;
        return true;
    }

    function typewrite() {
        if (sPart.length === 0 && scroll(aSheets[nIdx], 0, true) && nIdx++ === aSheets.length - 1) {
            clean();
            return;
        }

        oCurrent.nodeValue += sPart.charAt(0);
        sPart = sPart.slice(1);
    }

    function Sheet(oNode) {
        this.ref = oNode;
        if (!oNode.hasChildNodes()) {
            return;
        }
        this.parts = Array.prototype.slice.call(oNode.childNodes);

        for (var nChild = 0; nChild < this.parts.length; nChild++) {
            oNode.removeChild(this.parts[nChild]);
            this.parts[nChild] = new Sheet(this.parts[nChild]);
        }
    }

    var
        nIntervId, oCurrent = null, bTyping = false, bStart = true, nIdx = 0, sPart = "", aSheets = [], aMap = [];

    this.rate = nRate || 100;

    this.play = function () {
        if (bTyping) {
            return;
        }
        if (bStart) {
            var aItems = document.querySelectorAll(sSelector);

            if (aItems.length === 0) {
                return;
            }
            for (var nItem = 0; nItem < aItems.length; nItem++) {
                aSheets.push(new Sheet(aItems[nItem]));
                /*Uncomment the following line if you have previously hidden your elements via CSS:*/
                //aItems[nItem].style.visibility="visible";
            }

            bStart = false;
        }

        nIntervId = setInterval(typewrite, this.rate);
        bTyping = true;
    };

    this.pause = function () {
        clearInterval(nIntervId);
        bTyping = false;
    };

    this.terminate = function () {
        oCurrent.nodeValue += sPart;
        sPart = "";
        for (nIdx; nIdx < aSheets.length; scroll(aSheets[nIdx++], 0, false));
        clean();
    };
}

/* Usage: */
var oTWExample1 = new Typewriter(/* elements: */ "#article,h1,#info,#copyleft", /* frame rate (optional): */ 15);

/* default frame rate is 100: */
var oTWExample2 = new Typewriter("#controls");

/* you can also change the frame rate value modifying the "rate" property; for example:  */
//oTWExample2.rate = 150;

onload = function () {
    oTWExample1.play();
    oTWExample2.play();
};