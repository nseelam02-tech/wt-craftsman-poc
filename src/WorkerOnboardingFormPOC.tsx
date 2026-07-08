import { useState } from "react";
import {
    ThemeProvider,
    createTheme,
    CssBaseline,
    Box,
    Typography,
    Checkbox,
    TextField,
    MenuItem,
    Button,
    Chip,
    Divider,
    Paper,
    Autocomplete,
    CircularProgress,
} from "@mui/material";


const theme = createTheme({
    palette: {
        primary: { main: "#e35205" },
        text: { primary: "#1a1a1a" },
    },
    typography: {
        fontFamily:
            '-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        allVariants: {
            textAlign: "left",
        },
    },
    components: {
        MuiTextField: {
            defaultProps: { variant: "outlined" },
        },
    },
});

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "6px",
        fontSize: 13,
    },
    "& .MuiOutlinedInput-input": {
        padding: "10px 12px",
    },
};

const labelSx = {
    fontWeight: 700,
    fontSize: 13,
    color: "#1a1a1a",
    mb: 1,
    display: "block",
};

const requiredMark = (
    <Box component="span" sx={{ color: "#e35205" }}>
        {" *"}
    </Box>
);

/**
 * -------------------- CMIC craftsman lookup (mock) --------------------
 * In the real app this should be swapped for a service call, following
 * the same pattern as getManualEntryPeoplePage - e.g. a debounced,
 * server-paginated search hitting something like:
 *
 *   getCraftsmenEmployeeSearch(searchTerm) => CmicEmployeeDto[]
 *
 * The shape below (CmicEmployee) is a placeholder for whatever fields
 * CMIC actually pushes over for WT employees. Swap MOCK_CMIC_EMPLOYEES
 * and searchCmicEmployees() for the real service call and this
 * component's prefill logic below doesn't need to change.
 * ----------------------------------------------------------------------
 */
interface CmicEmployee {
    employeeId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    hardHatStickerNumber?: string;
}

const MOCK_CMIC_EMPLOYEES: CmicEmployee[] = [
    {
        employeeId: "WT10245",
        firstName: "Marcus",
        lastName: "Alvarez",
        phone: "+1 (423)-555-0192",
        email: "marcus.alvarez@whiting-turner.com",
        hardHatStickerNumber: "HH-88213",
    },
    {
        employeeId: "WT10389",
        firstName: "Priya",
        lastName: "Natarajan",
        phone: "+1 (423)-555-0147",
        email: "priya.natarajan@whiting-turner.com",
        hardHatStickerNumber: "HH-88477",
    },
    {
        employeeId: "WT10412",
        firstName: "Devon",
        lastName: "Whitfield",
        phone: "+1 (423)-555-0163",
        email: "devon.whitfield@whiting-turner.com",
        hardHatStickerNumber: "HH-88592",
    },
];

// Placeholder async search - swap for the real trackedCall()/apiGet() service call.
async function searchCmicEmployees(query: string): Promise<CmicEmployee[]> {
    await new Promise((r) => setTimeout(r, 250)); // simulate network latency
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_CMIC_EMPLOYEES;
    return MOCK_CMIC_EMPLOYEES.filter((e) =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q)
    );
}

interface TradeOption {
    value: string;
    label: string;
}

const TRADE_OPTIONS: TradeOption[] = [
    { value: "carpenter", label: "Carpenter" },
    { value: "electrician", label: "Electrician" },
    { value: "plumber", label: "Plumber" },
    { value: "ironworker", label: "Ironworker" },
    { value: "mason", label: "Mason" },
    { value: "laborer", label: "Laborer" },
    { value: "operator", label: "Equipment Operator" },
    { value: "painter", label: "Painter" },
    { value: "hvac", label: "HVAC Technician" },
    { value: "welder", label: "Welder" },
    { value: "drywall", label: "Drywall Installer" },
    { value: "roofer", label: "Roofer" },
    { value: "sitesupervisor", label: "Site Supervisor" },
    { value: "other", label: "Other" },
];

export default function WorkerOnboardingFormPOC() {
    const [isCraftsman, setIsCraftsman] = useState(false);

    // Craftsman employee search state
    const [employeeOptions, setEmployeeOptions] = useState<CmicEmployee[]>([]);
    const [employeeSearchLoading, setEmployeeSearchLoading] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<CmicEmployee | null>(
        null
    );

    // Fields that get prefilled from the selected CMIC employee record.
    // (Kept controlled only for these fields so existing uncontrolled
    // fields/behavior elsewhere in the form are untouched.)
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [hardHatStickerNumber, setHardHatStickerNumber] = useState("");
    const [selectedTrade, setSelectedTrade] = useState<TradeOption | null>(null);

    const handleCraftsmanToggle = (checked: boolean) => {
        setIsCraftsman(checked);
        // Reset craftsman-specific selection + any prefilled values when
        // switching modes, so stale data doesn't leak between flows.
        setSelectedEmployee(null);
        setEmployeeOptions([]);
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setHardHatStickerNumber("");
    };

    const handleEmployeeSearch = async (query: string) => {
        setEmployeeSearchLoading(true);
        try {
            const results = await searchCmicEmployees(query);
            setEmployeeOptions(results);
        } finally {
            setEmployeeSearchLoading(false);
        }
    };

    const handleEmployeeSelect = (employee: CmicEmployee | null) => {
        setSelectedEmployee(employee);
        if (employee) {
            setFirstName(employee.firstName);
            setLastName(employee.lastName);
            setPhone(employee.phone);
            setEmail(employee.email);
            setHardHatStickerNumber(employee.hardHatStickerNumber ?? "");
        } else {
            setFirstName("");
            setLastName("");
            setPhone("");
            setEmail("");
            setHardHatStickerNumber("");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 4,
                        py: 2,
                        bgcolor: "#fff",
                        borderBottom: "1px solid #e5e5e5",
                    }}
                >
                    <Box
                        sx={{
                            width: 34,
                            height: 34,
                            bgcolor: "#e35205",
                            borderRadius: 1,
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: 14,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        WT
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>
                            Whiting-Turner
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#777" }}>
                            Worker Onboarding
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ maxWidth: 1100, mx: "auto", px: 4, py: 4 }}>
                    {/* Title */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                        <Typography sx={{ fontSize: 24, fontWeight: 600, color: "#1a1a1a" }}>
                            New User Registration and Safety Orientation Form
                        </Typography>
                        <Chip
                            label={isCraftsman ? "WT Craftsman" : "Partner Worker"}
                            size="small"
                            sx={{
                                fontWeight: 600,
                                fontSize: 12,
                                bgcolor: isCraftsman ? "#fff1e6" : "#eef2ff",
                                color: isCraftsman ? "#e35205" : "#3b4ec0",
                            }}
                        />
                    </Box>
                    <Typography sx={{ color: "#777", fontSize: 13, mb: 3 }}>
                        022123 Alston Yards
                    </Typography>

                    {/* Mode toggle */}
                    <Paper
                        variant="outlined"
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5,
                            p: 2,
                            mb: 3,
                            borderRadius: "8px",
                            borderColor: "#e5e5e5",
                        }}
                    >
                        <Checkbox
                            checked={isCraftsman}
                            onChange={(e) => handleCraftsmanToggle(e.target.checked)}
                            sx={{
                                p: 0,
                                mt: 0.25,
                                color: "#e35205",
                                "&.Mui-checked": { color: "#e35205" },
                            }}
                        />
                        <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>
                                WT Craftsman
                            </Typography>
                            <Typography sx={{ fontSize: 12.5, color: "#777", mt: 0.25 }}>
                                Please Check this box if you are WT employee
                            </Typography>
                        </Box>
                    </Paper>

                    {isCraftsman && (
                        <Box
                            sx={{
                                bgcolor: "#fffbea",
                                border: "1px solid #f3e3a1",
                                borderRadius: "8px",
                                p: 1.75,
                                fontSize: 12,
                                color: "#7a5c00",
                                mb: 2.5,
                            }}
                        >
                            Company is fixed to <b>Whiting-Turner</b> for this flow. Select your
                            name below to match you to your existing <b>employee record</b> - the
                            rest of the form will prefill automatically.
                        </Box>
                    )}

                    {/* Scan badge */}
                    <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography sx={{ ...labelSx, mb: 0 }}>Scan BLE Badge{requiredMark}</Typography>
                        <Button
                            variant="outlined"
                            sx={{
                                borderColor: "#e35205",
                                color: "#e35205",
                                borderRadius: "20px",
                                textTransform: "none",
                                fontWeight: 600,
                                px: 2,
                                "&:hover": { borderColor: "#e35205", bgcolor: "#fff5ef" },
                            }}
                        >
                            Scan Badge
                        </Button>
                    </Box>

                    {/* Form grid */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                            columnGap: 4,
                            rowGap: 2.5,
                            mb: 3,
                        }}
                    >
                        {isCraftsman && (
                            <Box sx={{ gridColumn: { xs: "1", md: "1 / span 2" } }}>
                                <Typography sx={labelSx}>Employee Name{requiredMark}</Typography>
                                <Autocomplete
                                    options={employeeOptions}
                                    getOptionLabel={(o) => `${o.firstName} ${o.lastName}`}
                                    isOptionEqualToValue={(o, v) => o.employeeId === v.employeeId}
                                    loading={employeeSearchLoading}
                                    value={selectedEmployee}
                                    onChange={(_e, value) => handleEmployeeSelect(value)}
                                    onInputChange={(_e, value, reason) => {
                                        if (reason === "input") handleEmployeeSearch(value);
                                    }}
                                    onOpen={() => {
                                        if (employeeOptions.length === 0) handleEmployeeSearch("");
                                    }}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} key={option.employeeId}>
                                            <Box>
                                                <Typography sx={{ fontSize: 13.5 }}>
                                                    {option.firstName} {option.lastName}
                                                </Typography>
                                                <Typography sx={{ fontSize: 11.5, color: "#999" }}>
                                                    ID: {option.employeeId}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            size="small"
                                            sx={fieldSx}
                                            placeholder="Search your name / Busca tu nombre..."
                                            slotProps={{
                                                ...params.slotProps,
                                                input: {
                                                    ...params.slotProps.input,
                                                    endAdornment: (
                                                        <>
                                                            {employeeSearchLoading ? (
                                                                <CircularProgress color="inherit" size={16} />
                                                            ) : null}
                                                            {params.slotProps.input?.endAdornment}
                                                        </>
                                                    ),
                                                },
                                            }}
                                        />
                                    )}
                                />
                                <Typography sx={{ fontSize: 11.5, color: "#999", mt: 0.5 }}>
                                    {selectedEmployee
                                        ? `Matched to Employee ID ${selectedEmployee.employeeId} - form prefilled below.`
                                        : "Can't find your name? Contact your site admin - your record may not have synced from CMIC yet."}
                                </Typography>
                            </Box>
                        )}

                        <Box>
                            <Typography sx={labelSx}>
                                Enter your First Name / Ingresa tu Primer Nombre{requiredMark}
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                sx={fieldSx}
                                placeholder="Please Enter First Name / Ingrese tu Primer Nombre"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Box>

                        <Box>
                            <Typography sx={labelSx}>
                                Enter your Last Name / Ingresa tu Apellido{requiredMark}
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                sx={fieldSx}
                                placeholder="Please Enter Last Name / Ingrese tu Apellido"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Box>

                        {!isCraftsman && (
                            <Box>
                                <Typography sx={labelSx}>Company / Compañia{requiredMark}</Typography>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    sx={fieldSx}
                                    defaultValue=""
                                    slotProps={{ select: { displayEmpty: true } }}
                                >
                                    <MenuItem value="">
                                        Please Select Company / Favor de Seleccionar tu Compañía
                                    </MenuItem>
                                </TextField>
                            </Box>
                        )}

                        <Box>
                            <Typography sx={labelSx}>
                                Phone / Ingrese Tu Numero Telefonico{requiredMark}
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                sx={fieldSx}
                                placeholder="+1 (123)-456-7890"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </Box>

                        <Box>
                            <Typography sx={labelSx}>
                                Enter the Name of your Emergency Contact (Wife, Husband, Mother,
                                sibling...) / Ingresa el Nombre de un Contacto en Caso de Emergencia
                                (Esposa(o), Madre, Hermano(a)...){requiredMark}
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                sx={fieldSx}
                                placeholder="Please Enter Emergency Contact Name / Por favor ingrese el nombre del contacto de em..."
                            />
                        </Box>

                        <Box>
                            <Typography sx={labelSx}>
                                Enter the Phone Number of your Emergency Contact (Wife, Husband,
                                Mother, sibling...) / Ingresa el Número Telefónico de tu Contacto en
                                Caso de Emergencia (Esposa(o), Madre, Hermano(a)...){requiredMark}
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                sx={fieldSx}
                                placeholder="+1 (123)-456-7890"
                            />
                        </Box>

                        <Box>
                            <Typography sx={labelSx}>Trade / Comercio{requiredMark}</Typography>
                            <Autocomplete
                                fullWidth
                                size="small"
                                options={TRADE_OPTIONS}
                                getOptionLabel={(o) => o.label}
                                isOptionEqualToValue={(o, v) => o.value === v.value}
                                value={selectedTrade}
                                onChange={(_e, value) => setSelectedTrade(value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        size="small"
                                        sx={fieldSx}
                                        placeholder="Please Select Trade / Favor de Seleccionar tu Comercio"
                                    />
                                )}
                            />
                        </Box>

                        <Box>
                            <Typography sx={labelSx}>
                                Hard Hat Sticker Number / Numero de Sticker del Casco{requiredMark}
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                sx={fieldSx}
                                placeholder="Please Enter Hard Hat Sticker Number / Por favor, introduzca el número de la pegatina d..."
                                value={hardHatStickerNumber}
                                onChange={(e) => setHardHatStickerNumber(e.target.value)}
                            />
                        </Box>

                        <Box>
                            <Typography sx={labelSx}>Email / Correo electronico{requiredMark}</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                sx={fieldSx}
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Box>

                        <Box>
                            <Typography sx={labelSx}>Language / Idioma{requiredMark}</Typography>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                sx={fieldSx}
                                defaultValue=""
                                slotProps={{ select: { displayEmpty: true } }}
                            >
                                <MenuItem value="">
                                    Please Select Language / Favor de Ingresar el Idioma
                                </MenuItem>
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="es">Español</MenuItem>
                            </TextField>
                        </Box>
                    </Box>

                    {/* Disclaimer */}
                    <Paper
                        variant="outlined"
                        sx={{
                            display: "flex",
                            gap: 1.25,
                            p: 2,
                            mb: 3,
                            bgcolor: "#f3f3f5",
                            borderRadius: "8px",
                            borderColor: "#e5e5e5",
                        }}
                    >
                        <Checkbox sx={{ p: 0, mt: 0.25 }} />
                        <Typography sx={{ fontSize: 12.5, color: "#444", lineHeight: 1.6 }}>
                            Disclaimer (User Acknowledgment): By providing your name, email address
                            and/or mobile phone number, you consent to the collection and use of
                            this information solely for purposes tied to your employment including
                            identifying you, authorizing site access and badging, recording your
                            time, and sending you safety or operational communications and other
                            work-related notifications. Providing this information is required to
                            access the job site and receive necessary credentials. This information
                            will not be used for marketing or non-employment purposes and will not
                            be shared with third parties except as required to support these
                            functions or as required by law.
                        </Typography>
                    </Paper>

                    {/* Signature */}
                    <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#1a1a1a" }}>
                                Draw your signature / Ingresa tu firma{requiredMark}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "#999", cursor: "pointer" }}>
                                Clear
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                height: 120,
                                mt: 1,
                                bgcolor: "#fff",
                            }}
                        />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Actions */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
                        <Button
                            variant="outlined"
                            sx={{
                                borderColor: "#e35205",
                                color: "#e35205",
                                borderRadius: "6px",
                                textTransform: "none",
                                fontWeight: 600,
                                px: 2.5,
                            }}
                        >
                            Cancel / Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            disabled
                            sx={{
                                bgcolor: "#ddd",
                                color: "#888",
                                borderRadius: "6px",
                                textTransform: "none",
                                fontWeight: 600,
                                px: 2.5,
                                boxShadow: "none",
                            }}
                        >
                            Submit / Mandar
                        </Button>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}