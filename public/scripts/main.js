const URN = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2UtZGlnaXRhbC10d2luL0pldF9FbmdpbmVfTW9kZWwuemlw';

const options = {
	env: 'AutodeskProduction',
	getAccessToken: function(callback) {
		fetch('/api/auth/token')
		    .then((response) => response.json())
		    .then((json) => {
                const auth = json.access_token;
                callback(auth.access_token, auth.expires_in);
            });
	}
};

let app = null;

Autodesk.Viewing.Initializer(options, () => {
	app = new Autodesk.Viewing.ViewingApplication('viewer');
    app.registerViewer(app.k3D, Autodesk.Viewing.Private.GuiViewer3D, { extensions: ['HeatmapExtension'] });
    loadModel(URN);
});

function loadModel(urn) {
    return new Promise(function(resolve, reject) {
        function onDocumentLoadSuccess() {
            const viewables = app.bubble.search({ type: 'geometry' });
            if (viewables.length > 0) {
                app.selectItem(viewables[0].data, onItemLoadSuccess, onItemLoadFailure);
            }
        }
        function onDocumentLoadFailure() { reject('could not load document'); }
        function onItemLoadSuccess() {
            initMaintenanceTab();
            initProcurementTab();
            initViewer();
            resolve();
        }
        function onItemLoadFailure() { reject('could not load model'); }
        app.loadDocument('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
}

function initViewer() {
    NOP_VIEWER.setQualityLevel(/* ambient shadows */ false, /* antialiasing */ true);
    NOP_VIEWER.setGroundShadow(false);
    NOP_VIEWER.setGroundReflection(true);
    NOP_VIEWER.setGhosting(true);
    NOP_VIEWER.setEnvMapBackground(true);
    NOP_VIEWER.setLightPreset(5);
    NOP_VIEWER.setSelectionColor(new THREE.Color(0xEBB30B));
}