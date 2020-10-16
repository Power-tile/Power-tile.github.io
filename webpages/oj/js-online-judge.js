let jsOJ = new Vue({
    el: "#js-online-judge",
    data: {
        codeMirror: {},
        localVariableNames: [],
        data: [],
        currentProblem: 0,
        userCode: "",
        grade: 0,
        errorMessage: "",
        results: [], // 1 AC, 0 WA, -1 PENDING, -2 error
    },
    methods: {
        evaluate: function() {
            let count = 0, currentIndex = 0;
            this.results.splice(0);
            this.errorMessage = "";

            try {
                this.data[this.currentProblem].data.forEach((io, index) => {
                    let currentIndex = index;
                    let obj = io.input.reduce((result, val, index) => {
                        result[this.data[this.currentProblem].variables[index]] = val;
                        return result;
                    }, {});
                    let __result__ = "";
                    let __output__ = function() {
                        // arguments.forEach((outputEle) => {
                        //     __result__ += outputEle;
                        // });
                        for (let i = 0; i < arguments.length; i++) {
                            __result__ += arguments[i];
                        }
                    }
                    this.results.push(-1);

                    eval(this.processedCode);

                    if (__result__ === io.output) {
                        count++;
                        this.$set(this.results, currentIndex, 1);
                    } else {
                        this.$set(this.results, currentIndex, 0);
                    }
                });
            } catch (error) {
                this.$set(this.results, currentIndex, -2);
                this.errorMessage = `Error at sample ${currentIndex+1}: ` + error.message;
            }
        },
        changeProblem: function() {
            this.results.splice(0);
        }
    },
    mounted: function() {
        let self = this;

        let req = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        req.open("GET", "js-online-judge-info.json", true);
        req.onreadystatechange = function() {
            if (req.readyState === 4 && req.status === 200) {
                self.data = JSON.parse(req.responseText);
                self.$set(self, "localVariableNames", new Array(self.data.reduce((prev, problem) => {
                    return Math.max(prev, problem.variables.length);
                }, 0)).fill(""));

                setTimeout(() => {
                    self.codeMirror = CodeMirror.fromTextArea(self.$refs.codeArea, {
                        mode: "javascript",
                        indentUnit: 4,
                        theme: "xq-light"
                    });
                    self.codeMirror.on('change', (element) => {
                        self.userCode = element.getValue();

                        if (self.$emit) {
                            self.$emit('input', self.userCode);
                        }
                    });
                }, 10);
            }
        }
        req.send();
    },
    computed: {
        processedCode: function() {
            if (!this.data[this.currentProblem]) return "";

            let ret = this.userCode;
            this.data[this.currentProblem].variables.forEach((varName, index) => {
                let from = this.localVariableNames[index], to = varName;
                if (from === undefined || from === "") return;
                ret = ret.replace(eval('/\\b' + from + '\\b/g'), "obj['" + to + "']");
            });

            ret = ret.replace(/console\.log/g, "__output__");

            return ret;
        },
        disable: function() {
            return this.userCode.trim() === "" || this.localVariableNames.filter(name => name === "").length > 0;
        }
    }
});