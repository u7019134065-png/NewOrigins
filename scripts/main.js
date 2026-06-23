const resurrectionEnabled = { value: false };

Events.on(ClientLoadEvent, () => {
    Vars.ui.menuGroup.fill(t => {
        t.button(Icon.download, Styles.clearTransi, () => {
            showResurrectionMenu();
        }).size(50).tooltip("50% Resurrection");
    });

    Events.on(UnitDestroyEvent, e => {
        const unit = e.unit;
        if (!resurrectionEnabled.value) return;
        if (unit.team == Team.derelict || unit.team == Vars.player.team()) return;

        if (Mathf.chance(0.5)) {
            Timer.schedule(() => {
                const resurrected = unit.type.create(unit.team);
                resurrected.set(unit.x, unit.y);
                resurrected.health = unit.type.health * 0.5;
                resurrected.add();
                Fx.spawn.at(unit.x, unit.y);
            }, 0.4);
        }
    });
});

function showResurrectionMenu() {
    const dialog = new BaseDialog("50% Возрождение Врагов");

    dialog.cont.add("Если Enable — враги возрождаются с 50% шансом и 50% HP").wrap().pad(12).row();
    dialog.cont.add("Disable — отключает эффект").row();
    dialog.cont.add("Изменения применяются сразу (чит)").color(Color.scarlet).pad(8).row();

    dialog.cont.table(Tables => {
        Tables.button("Enable", () => {
            resurrectionEnabled.value = true;
            Vars.ui.showInfoToast("✅ Возрождение ВРАГОВ ВКЛЮЧЕНО", 4);
        }).size(240, 70).pad(10);

        Tables.button("Disable", () => {
            resurrectionEnabled.value = false;
            Vars.ui.showInfoToast("❌ Возрождение ВРАГОВ ВЫКЛЮЧЕНО", 4);
        }).size(240, 70).pad(10);
    }).row();

    dialog.addCloseButton("Закрыть");
    dialog.show();
}