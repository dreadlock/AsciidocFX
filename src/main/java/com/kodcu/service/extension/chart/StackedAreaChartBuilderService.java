package com.kodcu.service.extension.chart;

import com.kodcu.controller.ApplicationController;
import com.kodcu.other.Current;
import com.kodcu.service.ThreadService;
import javafx.scene.chart.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Created by usta on 31.03.2015.
 */
@Component("stacked-area-bean")
public class StackedAreaChartBuilderService extends XYChartBuilderService {

    private final ThreadService threadService;
    private final Current current;
    private final ApplicationController controller;

    @Autowired
    public StackedAreaChartBuilderService(ThreadService threadService, Current current, ApplicationController controller) {
        super(threadService, current, controller);
        this.threadService = threadService;
        this.current = current;
        this.controller = controller;
    }

    @Override
    protected XYChart<String, Number> createXYChart() {
        final CategoryAxis xAxis = new CategoryAxis();
        final NumberAxis yAxis = new NumberAxis();
        final XYChart<String, Number> lineChart = new StackedAreaChart<String, Number>(xAxis, yAxis);
        return lineChart;
    }


}
